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
  className?: string;
}) => {
  let colorClass = '';

  // Check conditions to apply color
  if (completed) {
    if (percent >= 125) {
      colorClass = 'golden-card'; // Gold when above 125%
    } else if (percent >= 100) {
      colorClass = 'bg-green-500 outline-green-500/[.2] outline-2 outline-offset-2'; // Green between 100% and 124%
    } else {
      colorClass = 'bg-red-500 outline-red-500/[.2]'; // Red below 100%
    }
  } else {
    colorClass = 'bg-gray-500 outline-gray-500/[.2]'; // Gray if not completed
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
  // Initialize sales state based on option
  const [sales, setSales] = useState(() =>
    Array.from({ length: option === "weekly" ? 5 : 4 }, () => 0)
  );

  useEffect(() => {
    // Reset sales array based on option
    const newSales = Array.from({ length: option === "weekly" ? 5 : 4 }, () => 0);

    // Process sales data based on selected option
    dataSource.forEach((data) => {
      const saleDate = dayjs(data.date);
      if (option === "weekly") {
        const dataDay = (saleDate.day() - dayjs().startOf("week").day() + 7) % 7;
        if (dataDay >= 0 && dataDay < newSales.length) {
          newSales[dataDay] += data.amount; // Aggregate sales for the day
        }
      } else if (option === "monthly") {
        const dataWeek = saleDate.week() - dayjs().startOf("month").week();
        if (dataWeek >= 0 && dataWeek < newSales.length) {
          newSales[dataWeek] += data.amount; // Aggregate sales for the week
        }
      }
    });

    setSales(newSales); // Update state with new sales data
  }, [dataSource, option]);

  const currentWeek = dayjs().week() - dayjs().startOf("month").week();
  const currentDay = dayjs().day() - dayjs().startOf("week").day();

  return (
    <div className="flex justify-evenly items-center !gap-2">
      {sales.map((p, i) => {
        // Calculate percentage based on target
        const percent = target > 0 ? (p / (option === "weekly" ? target / 20 : target / 4)) * 100 : 0;

        // Determine if the current block should be marked as completed
        const isCompleted = i < (option === "weekly" ? currentDay + 1 : currentWeek);
        
        // Define block color based on sales and percentage
        const blockColor = p === 0
          ? "bg-gray-500" // No data
          : percent > 70
          ? "bg-green-500" // Over 70% achieved
          : "bg-red-500"; // Below 70% achieved

        return (
          <SalesRepBlock
            key={i}
            percent={p === 0 ? 0 : percent} // Default to 0 if no data
            completed={isCompleted}
            className={blockColor}
          />
        );
      })}
    </div>
  );
};



interface Sale {
  date: string;
  amount: number;
  sellerId: number;
}

const SalesYTD = ({
  dataSource,
  targets,
}: {
  dataSource: Sale[];
  targets: {
    targetAmount: number;
    currentTarget: number;
  };
}) => {
  const { targetAmount, currentTarget } = targets;
  const [salesWithPercentages, setSalesWithPercentages] = useState<
    { date: string; amount: number; percentage?: string }[]
  >([]);
  const currentMonth = dayjs();
  const currentYear = currentMonth.year();
  
  const [selectedSale, setSelectedSale] = useState<{
    date: string;
    amount: number;
    percentage?: string;
  } | null>(null);

  useEffect(() => {
    if (!Array.isArray(dataSource)) {
      return;
    }

    // Aggregate sales by month
    const monthlySales: { [month: string]: number } = {};
    dataSource.forEach((data) => {
      const saleMonth = dayjs(data.date).format('YYYY-MM');
      monthlySales[saleMonth] = (monthlySales[saleMonth] || 0) + data.amount;
    });

    // Prepare an array for 12 months with percentages
    const salesDataWithPercentages = Array.from({ length: 12 }, (_, monthIndex) => {
      const month = dayjs(`${currentYear}-${monthIndex + 1}`, 'YYYY-M');
      const monthKey = month.format('YYYY-MM');
      const amount = monthlySales[monthKey] || 0;
      const isCurrentMonth = month.isSame(currentMonth, 'month');
      const target = isCurrentMonth ? currentTarget : targetAmount;
      const percentage = target > 0 ? (amount / target) * 100 : 0;

      return {
        date: monthKey,
        amount,
        percentage: amount > 0 ? `${percentage.toFixed(2)}%` : '',
      };
    });

    setSalesWithPercentages(salesDataWithPercentages);
  }, [dataSource, targets]);

  const handleSaleClick = (sale: { date: string; amount: number; percentage?: string }) => {
    setSelectedSale(sale);
  };

  const handleCloseModal = () => {
    setSelectedSale(null);
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        {salesWithPercentages.map((sale, i) => {
          const p = parseFloat(sale.percentage || '0');

          // Determine button color
          const buttonColor =
            sale.amount === 0
              ? 'bg-white border-4 border-gray-300 shadow-lg shadow-gray-100/50'
              : p >= 125
              ? 'golden-card'
              : p >= 100
              ? '!bg-green-500 outline-green-500/[.2]'
              : '!bg-red-500 outline-red-500/[.2]';

          return (
            <div className="flex flex-col items-center col-span-1" key={i}>
              <button
                className={`!w-8 !h-3 ${buttonColor}`}
                aria-label={`Sales for month ${sale.date}: ${sale.percentage}`}
                title={`Sales for month ${sale.date}: ${sale.percentage}`}
                onClick={() => handleSaleClick(sale)}
              />
              <span className="text-xs text-center mt-1">{sale.percentage}</span>
            </div>
          );
        })}
      </div>

      {selectedSale && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96 mx-auto">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center text-orange-600">Sale details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="sale-date"><strong>Date:</strong></label>
              <p className="text-gray-600" id="sale-date">{selectedSale.date}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="sale-amount"><strong>Amount:</strong></label>
              <p className="text-gray-600" id="sale-amount">${selectedSale.amount.toLocaleString()}</p>
            </div>
            
            {selectedSale.percentage && (
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="sale-percentage"><strong>Percentage:</strong></label>
                <p className="text-gray-600" id="sale-percentage">{selectedSale.percentage}</p>
              </div>
            )}
            
            <div className="mt-6">
              <button
                className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      console.error("Server responded with:", errorText);
      throw new Error(errorText);
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
  };

  useEffect(() => {
    fetchData();
    listUsers();

    if (!jwt) {
      intervalRef.current = setInterval(() => {
        // Check if scrolled to the bottom
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
          // Switch to Champions Board page by updating window location
          window.location.href = "/champions-board"; // Replace with the correct path for your Champions Board

          // Clear interval to stop further scrolling
          clearInterval(intervalRef.current!);
        } else {
          // Continue smooth scrolling
          window.scrollBy({
            top: 1,
            left: 0,
            behavior: "smooth",
          });
        }
      }, 100);

      // Return cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [jwt]);

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
                  <TableHead className="min-w-[200px] max-w-[300px] text-left">Name</TableHead>
                  {/* <TableHead className="text-center">Daily</TableHead> */}
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
                {!isFetching && (
                  data
                    .filter((name) =>
                      name.user.name.toLowerCase().includes(filter.toLowerCase())
                    )
                    .sort((a, b) => a.user.name.localeCompare(b.user.name)) // Sort alphabetically
                    .map((source, idx) => (
                      <TableRow key={idx} className="py-8">
                        <TableCell className="font-medium">
                          {source.user.name}
                        </TableCell>
                        {/* <TableCell>
                          <SalesReps
                            dataSource={source.sale}
                            option="weekly"
                            target={Number(source.user.targetAmount)}
                          />
                        </TableCell> */}
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
                          targets={{
                            targetAmount: Number(source.user.targetAmount), // Ensure you're getting the correct value for targetAmount
                            currentTarget: Number(source.user.currentTarget)  // Use currentTarget for the current month's target
                          }} 
                        />
                      </TableCell>
                      </TableRow>
                    ))
                )}
                {!isFetching && data.filter((name) => name.user.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
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


