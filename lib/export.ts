// lib/export.ts

/**
 * Downloads data as a CSV file.
 * @param data - Can be a single object or an array of objects
 * @param fileName - Desired name for the file
 */
export const exportToCSV = (data: any | any[], fileName: string) => {
  const dataArray = Array.isArray(data) ? data : [data];

  if (dataArray.length === 0 || !dataArray[0]) return;

  const headers = Object.keys(dataArray[0]).join(",");
  const rows = dataArray
    .map((row) =>
      Object.values(row)
        .map((val) => `"${val ?? ""}"`)
        .join(","),
    )
    .join("\n");

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.body.appendChild(document.createElement("a"));
  link.href = url;
  link.setAttribute("download", `${fileName}.csv`);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
