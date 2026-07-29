export async function downloadBlobAsCSV(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

export function buildRequestFilterParams(
  searchQuery?: string,
  appliedSourceFilter?: string,
  appliedStatusFilter?: string
) {
  const params: any = {};
  if (searchQuery) params.search = searchQuery;

  if (appliedSourceFilter && appliedSourceFilter !== "All") {
    params.source = appliedSourceFilter.toLowerCase();
  }
  
  if (appliedStatusFilter && appliedStatusFilter !== "All") {
    let apiStatus = appliedStatusFilter.toLowerCase().replace(/ /g, "_");
    if (apiStatus === "refund_completed") apiStatus = "refunded";
    if (apiStatus === "pending_payment" || apiStatus === "30%_pending_payment") apiStatus = "awaiting_payment";
    if (apiStatus === "replied") apiStatus = "in_progress";
    params.status = apiStatus;
  }
  
  return params;
}
