import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Role, userData, userState } from "@/constants/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { useAuth } from "@/hooks/use-auth";
import { jwtDecode } from "jwt-decode";
interface MyToken {
  name: string;
  role: Role;
  // whatever else is in the JWT.
}
const AdminPanel = () => {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [filtered, setFilter] = useState<string>("");
  const [users, setUsers] = useState<userData[]>([]);
  const [selected, setSelected] = useState<userData>();
  // const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { jwt } = useAuth();
  const decodedToken = jwt ? jwtDecode<MyToken>(jwt) : null;
  const [newData, setNewData] = useState<userState>({
    // avatar: "",
    name: "",
    email: "",
    targetAmount: 0,
    currentTarget: 0,
    role: "seller",
    password: "",
  });


  const { mutateAsync: listUsers, isPending: isFetching } = useMutation({
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
      if (data) {
        // setUsers((data as userData[]).sort((a, b) => (a.name < b.name ? -1 : 1)));
        setUsers(data as userData[]);
      }
    },
    onError: () => { },
  });

  const { mutateAsync: addUser, isPending: isAdding } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jwt}`,
          },
          body: JSON.stringify(newData),
        });
  
        if (!response.ok) {
          // Extract and throw detailed error message from response
          const errorDetails = await response.text();
          throw new Error(`Network response was not ok: ${errorDetails}`);
        }
  
        return response.json();
      } catch (error) {
        console.error("Error during fetch:", error);
        throw error; // Re-throw the error to be handled by onError
      }
    },
    onSuccess: (data) => {
      if (data) {
        setOpenAdd(false);
        setNewData({
          name: "",
          email: "",
          targetAmount: 0,
          currentTarget: 0,
          password: "",
          role: decodedToken?.role === "superAdmin" ? "admin" : "seller",
        });
        listUsers();
      }
    },
    onError: (error) => {
      console.error("Error during mutation:", error);
    },
  });
  
  

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/user/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwt,
          },
          body: JSON.stringify({ ...selected }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
        setOpenEdit(false);
        listUsers();
      }
    },
    onError: () => { },
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async () => {

      // console.log(decodedToken);
      // let userdeleteurl =  "http://localhost:3000/api/v1/sale";

      // if(selected?.role !== undefined)userdeleteurl = "http://localhost:3000/api/v1/user";


      const response = await fetch(
        "http://localhost:3000/api/v1/user",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + jwt,
          },
          body: JSON.stringify({ email: selected?.email, role: selected?.role ?? "seller" }),
        }
      );
     
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data) {
       setOpenConfirm(false);
       listUsers();
      }
    },
    onError: () => { },
  });

  const addSubmitHandler = async (_: React.FormEvent<HTMLFormElement>) => {
    _.preventDefault();
    addUser();
  };

  const submitHandler = async (_: React.FormEvent<HTMLFormElement>) => {
    _.preventDefault();
    updateUser();
  };

  const editHandler = (id: number) => {
    setOpenEdit(true);
    setSelected(users[id]);
  };

  const deleteHandler = (id: number) => {
    setOpenConfirm(true);
    setSelected(users[id]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <div className="flex">
      <div className="pl-[58px] w-full h-full min-h-screen flex flex-col items-stretch">
        <Card className="m-10  bg-gray-50">
          <CardHeader>
            <div className="flex gap-4 text-orange-500 flex-col md:flex-row justify-stretch md:justify-start items-start md:items-center">
              <h2 className="text-2xl font-semibold flex-grow">
                User Admin Panel
              </h2>
              <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                <Input
                  type="text"
                  value={filtered}
                  onChange={(e) => {
                    e.preventDefault();
                    setFilter(e.target.value);
                  }}
                  placeholder="Search Users..."
                  className="!ring-0 !ring-offset-0 min-w-[200px] flex-grow"
                />
                <Button
                  size={"sm"}
                  className="!ring-0 !ring-offset-0"
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                >
                  Add New User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full max-w-full">
            <div className="!rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Name</TableHead>
                    {decodedToken?.role === "superAdmin" && <TableHead className="text-center">Email</TableHead>}
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Target Amount</TableHead>
                    <TableHead className="text-center">Current Target</TableHead>
                    <TableHead className="text-left">Created At</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isFetching &&
                    !!users.length &&
                    users
                      .filter((user) => user.name?.includes(filtered))
                      .map((user: userData, idx: number) => (
                        <TableRow
                          key={idx}
                          className="py-8 cursor-pointer select-none"
                          onClick={() => setSelected(user)}
                        >
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          {decodedToken?.role === "superAdmin" &&<TableCell className="font-medium text-center">
                            {user.email || "—"}
                          </TableCell>}
                          <TableCell className="font-medium text-center">
                            {user.role || "seller"}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {user .targetAmount || "—"}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            {user .currentTarget || "—"}
                          </TableCell>
                          <TableCell className="font-medium text-left">
                            {dayjs(user.createdAt).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell className="flex gap-5 justify-center">
                            <FaRegEdit
                              className="text-green-500 hover:text-green-700 transition-all text-xl"
                              onClick={() => editHandler(idx)}
                            />
                            <MdDelete
                              className="text-red-500 hover:text-red-700 transition-all text-xl"
                              onClick={() => deleteHandler(idx)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  {!isFetching && !users.length && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <div className="py-3 flex justify-center items-center text-gray-500 font-semibold">
                          No user found
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-1/4 h-full min-h-screen items-stretch">
        <Card className="my-10 mr-10 bg-gray-50">
          <CardHeader>
            <div className="flex gap-4 text-orange-500 flex-col md:flex-row justify-stretch md:justify-start items-start md:items-center">
              <h2 className="text-2xl font-semibold flex-grow text-center">
                User Detail Info
              </h2>
            </div>
          </CardHeader>
          <CardContent className="w-full max-w-full min-h-100">
            <div className="!rounded-md border">
              {selected && (
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Name</TableCell>
                      <TableCell>{selected?.name}</TableCell>
                    </TableRow>
                    {decodedToken?.role === "superAdmin" && <TableRow>
                      <TableCell className="font-semibold">Email</TableCell>
                      <TableCell>{selected?.email}</TableCell>
                    </TableRow>}
                    <TableRow>
                      <TableCell className="font-semibold">
                        Created At
                      </TableCell>
                      <TableCell>
                        {dayjs(selected?.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Target</TableCell>
                      <TableCell>$ {selected?.targetAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Current target</TableCell>
                      <TableCell>$ {selected?.targetAmount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
              {!selected && (
                <div className="h-48 flex justify-center items-center text-gray-500 font-semibold">
                  No user selected
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-semibold text-orange-500 text-lg">
              Edit User Information
            </h2>
          </DialogHeader>
          <form className="flex flex-col gap-3" onSubmit={submitHandler}>
            {decodedToken?.role === "superAdmin" && selected?.role === "admin" && <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[140px]">Email: </Label>
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={selected?.email}
                  disabled
                />
              </div>
            </div>}
            <div className="flex gap-2 items-center ">
              <Label className="w-[140px]">Name</Label>
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={selected?.name}
                  onChange={(e) => {
                    if (selected)
                      setSelected({ ...selected, name: e.target.value });
                  }}
                  disabled = {decodedToken?.role === "superAdmin" && selected?.role !== "admin" || decodedToken?.role === "admin"}
                />
              </div>
            </div>
            {(decodedToken?.role === "admin" || (decodedToken?.role === "superAdmin" && selected?.role !== "admin"))&& <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[200px]">Current Amount: </Label>
              <div className="flex-grow relative w-full">
              <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
                  $
                </div>
                <Input
                  type="text"
                  placeholder="0"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={selected?.targetAmount}
                  onChange={(e) => {
                    if (selected)
                      setSelected({
                        ...selected,
                        targetAmount: Number(e.target.value),
                      });
                  }}
                  disabled = {decodedToken?.role === "superAdmin" && selected?.role !== "admin" || decodedToken?.role === "admin"}
                />
              </div>
            </div>}
            {(decodedToken?.role === "admin" || (decodedToken?.role === "superAdmin" && selected?.role !== "admin"))&& <div className="flex gap-2 items-center max-w-2/3">
              <Label className="w-[200px]">New Target: </Label>
              <div className="flex-grow relative w-full">
              <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
                  $
                </div>
                <Input
                  type="text"
                  placeholder="0"
                  className="!ring-0 !ring-offset-0 w-full"
                  value={selected?.currentTarget || 0}
                  onChange={(e) => {
                    if (selected)
                      setSelected({
                        ...selected,
                        currentTarget: Number(e.target.value),
                      });
                  }}
                />
              </div>
            </div>}
            <Button className="flex gap-2" type="submit" disabled={isUpdating}>
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-semibold text-orange-500 text-lg">
              Delete User
            </h2>
            <div className="flex flex-col gap-4 items-stretch">
              <div>Do you want to delete this user?</div>
              <div className="flex gap-2">
                <Button onClick={() => deleteUser()} disabled={isDeleting}>
                  Yes
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => setOpenConfirm(false)}
                  disabled={isDeleting}
                >
                  No
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
  <DialogContent>
    <DialogHeader>
      <h2 className="font-semibold text-orange-500 text-lg">
        Add New {decodedToken?.role === "superAdmin" ? (newData.role === "admin" ? "Admin" : "Seller") : "Seller"}
      </h2>
    </DialogHeader>
    <form className="flex flex-col gap-3" onSubmit={addSubmitHandler}>
      <div className="flex items-center justify-center w-full mb-6">
        <label className="flex flex-col w-32 h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="pt-2 w-auto h-28 object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400 pt-8 group-hover:text-gray-600" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd" />
                </svg>
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                  Select a photo
                </p>
              </div>
            )}
          </div>
          <input type="file" className="opacity-0" onChange={handleImageChange} />
        </label>
      </div>
      
      {/* Show email field for both Admin and Seller if SuperAdmin */}
      {decodedToken?.role === "superAdmin" && (
        <div className="flex gap-2 items-center max-w-2/3">
          <Label className="w-[120px]">Email: </Label>
          <div className="flex-grow">
            <Input
              type="email"
              placeholder="JohnDoe@gmail.com"
              className="!ring-0 !ring-offset-0 w-full"
              value={newData.email}
              onChange={(e) => {
                setNewData({ ...newData, email: e.target.value });
              }}
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-2 items-center ">
        <Label className="w-[120px]">Name</Label>
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="John Doe"
            className="!ring-0 !ring-offset-0 w-full"
            value={newData.name}
            onChange={(e) => {
              setNewData({ ...newData, name: e.target.value });
            }}
            required
          />
        </div>
      </div>

      {/* Password field for Admin */}
      {decodedToken?.role === "superAdmin" && newData.role === "admin" && (
        <div className="flex gap-2 items-center">
          <Label className="w-[120px]">Password</Label>
          <div className="flex-grow">
            <Input
              type="password"
              placeholder="*********"
              className="!ring-0 !ring-offset-0 w-full"
              value={newData.password}
              onChange={(e) => {
                setNewData({ ...newData, password: e.target.value });
              }}
            />
          </div>
        </div>
      )}

      {/* Role selection for SuperAdmin */}
      {decodedToken?.role === "superAdmin" && (
        <div className="flex gap-2 items-center">
          <Label className="w-[120px]">Role</Label>
          <div className="flex-grow">
            <Select
              onValueChange={(value) => {
                setNewData({ ...newData, role: value as Role });
              }}
            >
              <SelectTrigger className="w-full !ring-0 !ring-offset-0 ">
                <SelectValue placeholder="Seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Monthly Target field for Seller */}
      {decodedToken?.role !== "superAdmin" || newData.role === "seller" && (
        <div className="flex gap-2 items-center max-w-2/3">
          <Label className="w-[165px]">Monthly Target</Label>
          <div className="flex-grow relative w-full">
            <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
              $
            </div>
            <Input
              type="text"
              placeholder="0"
              className="!ring-0 !ring-offset-0 w-full peer"
              value={newData.targetAmount}
              onChange={(e) => {
                setNewData({
                  ...newData,
                  targetAmount: Number(e.target.value),
                });
              }}
              required
            />
          </div>
        </div>
      )}

      <Button className="flex gap-2" type="submit" disabled={isAdding}>
        Add User
      </Button>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default AdminPanel;
