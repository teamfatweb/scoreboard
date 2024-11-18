import React, { useState, useEffect, ChangeEvent } from "react";
import { Button } from "../components/ui/button";
import Swal from "sweetalert2";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { MdSave, MdCancel, MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "@/hooks/use-auth";

// Define the type for a single champion data entry
type ChampionData = {
  id: number;
  year: number;
  markat: string;
  jobSpace: string;
  aMarkDirect: string;
  aMarkPublishing: string;
  createdAt: string;
  updatedAt: string;
};

// Define the type for the grouped data (accumulator)
type GroupedChampionData = {
  [year: number]: ChampionData[];
};

const ChampionBoard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const [years, setYears] = useState<number[]>([]);
  const [data, setData] = useState<GroupedChampionData>({});
  const [filtered, setFilter] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [editMode, setEditMode] = useState<{ [year: number]: boolean }>({});
  
  const { jwt } = useAuth(); // Get the JWT token from Zustand store

  useEffect(() => {
    fetchChampionData();
  }, []);

  const fetchChampionData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/champions/getChampionData");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const fetchedData: ChampionData[] = await response.json();
      const groupedData = groupDataByYear(fetchedData);
      setYears(Object.keys(groupedData).map(Number).sort((a, b) => b - a));
      setData(groupedData);
    } catch (error) {
      Swal.fire("Error", "Could not load champion data.", "error");
    }
  };

  const groupDataByYear = (data: ChampionData[]) => {
    return data.reduce<GroupedChampionData>((acc, champion) => {
      const year = champion.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(champion);
      return acc;
    }, {});
  };

  const handleEditToggle = (year: number) => {
    setEditMode((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const addYear = () => {
    if (!years.includes(selectedYear)) {
      setYears((prev) => [selectedYear, ...prev].sort((a, b) => b - a));
      setData((prevData) => ({
        ...prevData,
        [selectedYear]: [{
          id: Date.now(),
          year: selectedYear,
          markat: "",
          jobSpace: "",
          aMarkDirect: "",
          aMarkPublishing: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }], 
      }));
    } else {
      Swal.fire("Year already exists", "The selected year is already in the list.", "info");
    }
  };

  const removeChampionData = async (id: number, year: number) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this champion data?",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/championData/${id}`, { method: "DELETE" });
        if (response.ok) {
          setData((prevData) => {
            const updatedData = { ...prevData };
            updatedData[year] = updatedData[year].filter((champion) => champion.id !== id);
            if (updatedData[year].length === 0) delete updatedData[year];
            return updatedData;
          });
          Swal.fire("Success", "Champion data removed successfully!", "success").then(() => {
            // Reload the page after the success message is closed
            window.location.reload();
          });
        } else {
          throw new Error("Failed to remove champion data");
        }
      } catch (error) {
        Swal.fire("info", "No Data to delete.", "info").then(() => {
          // Reload the page after the info message is closed
          window.location.reload();
        });
      }
    }
  };

  const handleInputChange = (year: number, field: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [year]: prevData[year].map((champion) =>
        champion.year === year ? { ...champion, [field]: value, updatedAt: new Date().toISOString() } : champion
      ),
    }));
  };

  const handleSave = async (year: number) => {
    try {
      const championToSave = data[year][0];
      const response = await fetch("http://localhost:3000/api/v1/champions/saveChampionData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, data: championToSave }),
      });

      if (!response.ok) throw new Error("Failed to save data");

      Swal.fire("Saved!", `Data has been saved for year ${year}`, "success");
      await fetchChampionData(); // Refresh data after saving
    } catch (error) {
      Swal.fire("Error", "Failed to save data.", "error");
    }
  };

  return (
    <div className="flex flex-col items-stretch w-full h-full min-h-screen pl-[58px]">
      <Card className="m-10 bg-gray-50">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:gap-10 items-start justify-between text-orange-500">
            <h2 className="text-2xl font-semibold flex-grow">Champions Board</h2>
            {/* Only show the search and year dropdown if logged in */}
            {jwt && (
              <div className="flex gap-4 items-center w-full md:w-auto">
                <Input
                  type="text"
                  value={filtered}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                  placeholder="Search Year..."
                  className="!ring-0 !ring-offset-0 min-w-[200px] flex-grow"
                />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border p-2 rounded"
                >
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                <Button size="sm" onClick={addYear} className="!ring-0 !ring-offset-0">
                  Add Year
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="w-full max-w-full">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Year</TableHead>
                <TableHead className="w-[200px]">Markat</TableHead>
                <TableHead className="w-[200px]">Job Space</TableHead>
                <TableHead className="w-[200px]">A Mark Direct</TableHead>
                <TableHead className="w-[200px]">A Mark Publishing</TableHead>
                <TableHead className="w-[150px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {years.filter((year) => year.toString().includes(filtered)).map((year) => (
                <TableRow key={year}>
                  <TableCell>{year}</TableCell>
                  <TableCell>
                    {editMode[year] ? (
                      <Input
                        value={data[year] && data[year][0] ? data[year][0].markat : ""}
                        onChange={(e) => handleInputChange(year, "markat", e.target.value)}
                      />
                    ) : (
                      data[year] && data[year][0] ? data[year][0].markat : ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[year] ? (
                      <Input
                        value={data[year] && data[year][0] ? data[year][0].jobSpace : ""}
                        onChange={(e) => handleInputChange(year, "jobSpace", e.target.value)}
                      />
                    ) : (
                      data[year] && data[year][0] ? data[year][0].jobSpace : ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[year] ? (
                      <Input
                        value={data[year] && data[year][0] ? data[year][0].aMarkDirect : ""}
                        onChange={(e) => handleInputChange(year, "aMarkDirect", e.target.value)}
                      />
                    ) : (
                      data[year] && data[year][0] ? data[year][0].aMarkDirect : ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[year] ? (
                      <Input
                        value={data[year] && data[year][0] ? data[year][0].aMarkPublishing : ""}
                        onChange={(e) => handleInputChange(year, "aMarkPublishing", e.target.value)}
                      />
                    ) : (
                      data[year] && data[year][0] ? data[year][0].aMarkPublishing : ""
                    )}
                  </TableCell>
                  <TableCell className="flex justify-center gap-2">
                    {editMode[year] ? (
                      <>
                        <Button onClick={() => handleSave(year)} size="sm" className="!ring-0 !ring-offset-0">
                          <MdSave />
                        </Button>
                        <Button onClick={() => handleEditToggle(year)} size="sm" className="!ring-0 !ring-offset-0">
                          <MdCancel />
                        </Button>
                      </>
                    ) : (
                      <>
                        {jwt && (
                          <Button onClick={() => handleEditToggle(year)} size="sm" className="!ring-0 !ring-offset-0">
                            <FaRegEdit />
                          </Button>
                        )}
                        {jwt && (
                          <Button onClick={() => removeChampionData(data[year][0].id, year)} size="sm" className="!ring-0 !ring-offset-0">
                            <MdDelete />
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChampionBoard;
