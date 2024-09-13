import SetTargetModal from '../components/ui/SetTargetModal';
import { Button } from "@/components/ui/button";
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Swal from 'sweetalert2';
import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import {
  FaPlus,
  FaSalesforce,
  FaMinus
  // FaAnglesDown,
  // FaAnglesUp,
} from "react-icons/fa6";
import { MdFreeCancellation } from "react-icons/md";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useAuth } from "@/hooks/use-auth";

dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);

type DataType = {
  date: string;
  amount: number;
};

type ModeType = "weekly" | "monthly" | "ytd";

const SalesRepBlock = ({
  percent,
  completed,
}: {
  percent: number;
  completed: boolean;
}) => {
  let colorClass = '';

  if (completed) {
    if (percent > 100) {
      colorClass = 'golden-card'; 
    } else if (percent === 100) {
      colorClass = 'bg-green-500 outline-green-500/[.2] outline-2 outline-offset-2';
    } else {
      colorClass = 'bg-red-500 outline-red-500/[.2]';
    }
  } else {
    colorClass = 'bg-gray-500 outline-gray-500/[.2]';
  }

  return (
    <Button
      className={cn('!w-12 !h-12 shadow-md rounded-none outline !outline-4', colorClass)}
    >
      {completed && <span>{percent.toFixed(0)}%</span>}
    </Button>
  );
};

const SalesReps = ({
  dataSource,
  option,
  target,
}: {
  dataSource: DataType[];
  option: ModeType;
  target: number;
}) => {
  const [sales, setSales] = useState(() =>
    Array.from({ length: option === "weekly" ? 5 : 4 }, () => 0)
  );

  useEffect(() => {
    if (option === "weekly") {
      const newSales = Array.from({ length: 5 }, () => 0);

      dataSource.forEach((data) => {
        const dataDay =
          (dayjs(data.date).day() - dayjs().startOf("week").day() + 7) % 7;
        if (dataDay >= 0 && dataDay < newSales.length) {
          newSales[dataDay] += data.amount;
        }
      });
      setSales(newSales);
    }

    if (option === "monthly") {
      const newSales = Array.from({ length: 4 }, () => 0);

      dataSource.forEach((data) => {
        const dataWeek =
          dayjs(data.date).week() - dayjs().startOf("month").week();
        if (dataWeek >= 0 && dataWeek < newSales.length) {
          newSales[dataWeek] += data.amount;
        }
      });

      setSales(newSales);
    }
  }, [dataSource, option]);

  const currentWeek = dayjs().week() - dayjs().startOf("month").week();
  const currentDay = dayjs().day() - dayjs().startOf("week").day();

  return (
    <div className="flex justify-evenly items-center !gap-2">
      {sales.map((p, i) => (
        <SalesRepBlock
          key={i}
          percent={(p / (option === "weekly" ? target / 20 : target / 5)) * 100}
          completed={i < (option === "weekly" ? currentDay + 1 : currentWeek)}
        />
      ))}
    </div>
  );
};

const SalesYTD = ({
  dataSource,
  target,
}: {
  dataSource: DataType[];
  target: number;
}) => {
  const [sales, setSales] = useState(() => Array.from({ length: 12 }, () => 0));

  const currentMonth = dayjs().month();

  useEffect(() => {
    const newSales = Array.from({ length: 12 }, () => 0);

    dataSource
      .filter((data) => dayjs(data.date).year() === dayjs().year())
      .forEach((data) => {
        const dataMonth = dayjs(data.date).month();
        newSales[dataMonth] += data.amount;
      });
    setSales(newSales);
  }, [dataSource]);

  return (
    <div className="flex items-center justify-between gap-2">
      {sales.map((sale, i) => {
        const p = (sale / target) * 100;
        return (
          <Button
            key={i}
            className={cn(
              "!w-4 !h-4 !max-w-4 !min-w-4 !min-h-4 !max-h-4 rounded-none",
              i <= currentMonth
                ? p > 70
                  ? "!bg-green-500 outline-green-500/[.2]"
                  : "!bg-red-500  outline-red-500/[.2]"
                : "!bg-gray-500 outline-gray-500/[.2]"
            )}
          />
        );
      })}
    </div>
  );
};

const Scoreboard = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [cancelDialog, setCancelDialog] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [saleList, setSaleList] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState({ 
    startDate: null ,
    endDate: null 
    }); 
  const { jwt } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [deleteSaleId, setDeleteSaleId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const [createdBy, setCreatedBy] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(11))
  });

  const handleValueChange = (newValue: any) => {
    setCreatedBy(newValue);
  };
  const handleDateChange = (selectedDate: any) => {
    setSelectedDate(selectedDate);
    // Update the amount based on the selected date
    const selectedSale = saleList.find((sale: any) => {
      const start = new Date(sale.date);
      const end = new Date(selectedDate.startDate);

      return start.toDateString() === end.toDateString();
    });
    
   
    if (selectedSale) {
      
      setAmount(selectedSale.amount);
      setDeleteSaleId(selectedSale.id);
     
    }
  };

  const { mutateAsync: fetchData, isPending: isFetching } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/sale",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setData(data);
    },
    onError: () => {
      setOpenDialog(true);
    },
  });

const [openSetTargetModal, setOpenSetTargetModal] = useState<boolean>(false);

const { mutateAsync: addSale, isPending: addingSale } = useMutation({
  mutationFn: async (data: { userId: number; amount: number; createdBy: Date }) => {
    const response = await fetch("http://localhost:3000/api/v1/sale/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + jwt,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with:", errorText); // Log the server response
      throw new Error(errorText); // Throw the actual server error text
    }
    return response.json();
  },
  onSuccess: (result) => {
    const { status, message } = result.payload;

    if (status === 'success') {
      // Initialize data and close modal
      initializeData();
      fetchData();
      setOpenDialog(false); // Assuming this is for another modal
    } else if (status === 'targetExceeded') {
      Swal.fire({
        icon: 'warning',
        title: 'Target Exceeded',
        text: message,
        confirmButtonText: 'Set New Target',
        preConfirm: () => {
          // Set openSetTargetModal to true to show the SetTargetModal
          setOpenSetTargetModal(true);
          Swal.close();
        }
      });
    }
  },
  onError: (error) => {
    console.error('Error:', error); // Log detailed error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `An error occurred while adding the sale: ${error.message}`,
    });
  },
});


const handleTargetUpdate = async (newTarget: number) => {
  // Assuming `selectedUser` is already the `sellerId`
  const sellerId = users.find((user) => user.name === selectedUser)?.id;

  // Validate input values
  if (!sellerId || isNaN(newTarget) || newTarget <= 0) {
    console.error("Invalid input values:", { sellerId, newTarget });
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/target/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`, // Ensure JWT token is included in the headers
      },
      body: JSON.stringify({
        sellerId,
        amount: newTarget,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Log the response text
      console.error("Server responded with:", errorText);
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Target updated successfully", data);
    fetchData(); // Refresh data if needed

    // Close the modal after a successful update
    setOpenSetTargetModal(false);
  } catch (error) {
    console.error("Error updating target:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating the target.',
    });
  }
};
  
  
  
  
  


 const {mutateAsync: deleteSale, isPending: removingSale} = useMutation({
    mutationFn: async (data: { id: number }) => {
      const response = await fetch(
        "http://localhost:3000/api/v1/sale/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwt,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      initializeData();
      fetchData();
      setCancelDialog(false);
    },
    onError: () => { },
  })

  const initializeData = () =>{
    setDeleteSaleId(null);
   // setSelectedDate("");
    setSelectedUser("");
    setSaleList([]);
    setAmount(0);
  }

  const { mutateAsync: listUsers } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwt,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUsers(data);
    },
    onError: () => { },
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !selectedUser || !createdBy.startDate) return;
    const userId = users.find((user) => user.name === selectedUser)?.id;
    addSale({ userId, amount, createdBy: createdBy.startDate });
  };
  const CancelsubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (deleteSaleId === null) return;
    deleteSale({ id: deleteSaleId });
  };

  const changedSelectedUser = (value: string) => {
    setSaleList(data.find((user) => user.user.name === value)?.sale);
  }

  useEffect(() => {
    fetchData();
    listUsers();
    if (!jwt) {
      intervalRef.current = setInterval(() => {
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight
        )
          window.scrollTo(0, 0);
        window.scrollBy({
          top: 1,
          left: 0,
          behavior: "smooth",
        });
      }, 100);

      // Return cleanup function
      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, []);

  const saleList_custom_picker =  saleList.reduce((carry: any , item:any , index:number)=>{
    var mydate = new Date(item.date);
   carry["customToday"+ "_" + index] = {
    text: mydate.toDateString(),
    period: {
      start: item.date,
      end: item.date
    }
  };

    return  carry;
} , {})



  return (
    <div
      className={cn(
        { "pl-[58px]": jwt },
        "w-full h-full min-h-screen flex flex-col items-stretch"
      )}
    >
      <Card className="m-8 bg-gray-50">
        <CardHeader>
          <div className="flex gap-4 text-orange-500 flex-col md:flex-row justify-stretch md:justify-start items-start md:items-center">
            <h2 className="text-2xl font-semibold flex-grow">
              Sales Scoreboard
            </h2>
            {jwt && (
              <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                <Input
                  type="text"
                  value={filter}
                  onChange={(e) => {
                    e.preventDefault();
                    setFilter(e.target.value);
                  }}
                  placeholder="Search Sales..."
                  className="!ring-0 !ring-offset-0 min-w-[200px] flex-grow"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} className="!ring-0 !ring-offset-0">
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDialog(true);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FaSalesforce size={16} />
                        New Sale
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                        e.preventDefault();
                        setCancelDialog(true);
                      }}>
                      <div className="flex items-center gap-2">
                        <MdFreeCancellation size={16} />
                        Cancellation
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="w-full max-w-full">
          <div className="!rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead className="text-center">Weekly</TableHead>
                  <TableHead className="text-center">Monthly</TableHead>
                  <TableHead className="text-left">YTD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching &&
                  data
                    .filter((name) =>
                      name.user.name
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    )
                    // .slice(visibleStart, visibleEnd)
                    .map((source, idx) => (
                      <TableRow key={idx} className="py-8">
                        <TableCell className="font-medium">
                          {source.user.name}
                        </TableCell>
                        <TableCell>
                          <SalesReps
                            dataSource={source.sale}
                            option="weekly"
                            target={Number(source.user.targetAmount)}
                          />
                        </TableCell>
                        <TableCell>
                          <SalesReps
                            dataSource={source.sale}
                            option="monthly"
                            target={Number(source.user.targetAmount)}
                          />
                        </TableCell>
                        <TableCell>
                          <SalesYTD
                            dataSource={source.sale}
                            target={Number(source.user.targetAmount)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                {!isFetching &&
                  data.filter((name) =>
                    name.user.name.toLowerCase().includes(filter.toLowerCase())
                  ).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SetTargetModal
        open={openSetTargetModal}
        onClose={() => setOpenSetTargetModal(false)}
        onUpdate={handleTargetUpdate}
        initialTarget={0}
        sellerName={selectedUser}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-semibold text-orange-500 text-lg">New Sales</h2>
          </DialogHeader>
          <form className="flex flex-col gap-3" onSubmit={submitHandler}>
            <div className="flex gap-2 items-center ">
              <Label className="w-[80px]">Sales Rep: </Label>
              <div className="flex-grow">
                <Select
                  value={selectedUser}
                  onValueChange={(value) => {
                    setSelectedUser(value);
                  }}
                >
                  <SelectTrigger className="!ring-0 !ring-offset-0 flex-shrink">
                    <SelectValue placeholder="Select Sales Rep">
                      {selectedUser}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="!ring-0 !ring-offset-0">
                    <SelectGroup>
                      {users.filter((user) => user.role !== "admin").map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[80px]">Amount: </Label>
              <div className="flex-grow">
                <Input
                  type="number"
                  value={amount}
                  placeholder="$3000"
                  className="!ring-0 !ring-offset-0 w-full"
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[80px]">Date: </Label>
              <Datepicker value={createdBy} useRange={false} maxDate={new Date()} 
                asSingle={true} onChange={handleValueChange} />
            </div>
            <Button className="flex gap-2" disabled={addingSale} type="submit">
              <FaPlus />
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-semibold text-orange-500 text-lg">Cancel Sale</h2>
          </DialogHeader>
          <form className="flex flex-col gap-3" onSubmit={CancelsubmitHandler}>
            <div className="flex gap-2 items-center ">
              <Label className="w-[80px]">Sales Rep: </Label>
              <div className="flex-grow">
                <Select
                  value={selectedUser}
                  onValueChange={(value) => {
                    setSelectedUser(value);
                    changedSelectedUser(value);
                  }}
                >
                  <SelectTrigger className="!ring-0 !ring-offset-0 flex-shrink">
                    <SelectValue placeholder="Select Sales Rep">
                      {selectedUser}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="!ring-0 !ring-offset-0">
                    <SelectGroup>
                      {users.filter((user) => user.role !== "admin").map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[80px]">Date: </Label>
              <div className="flex-grow">
                  
              <Datepicker value={selectedDate} useRange={false} maxDate={new Date()} onChange={handleDateChange}
                showShortcuts={true} 
                asSingle={true} 
               configs={{shortcuts:saleList_custom_picker??null}}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[80px]">Amount: </Label>
              <div className="flex-grow">
                <Input
                  type="number"
                  value={amount}
                  placeholder="$3000"
                  className="!ring-0 !ring-offset-0 w-full"
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                  
                />
              </div>
            </div>
           
            <Button className="flex gap-2" disabled={removingSale} type="submit">
              <FaMinus />
              Cancel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default Scoreboard;


