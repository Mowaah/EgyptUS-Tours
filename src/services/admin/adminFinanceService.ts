import { adminDataClient } from '@/lib/adminCoreApi';

export async function getPayments(params?: any): Promise<any> {
  return await adminDataClient.get('/finance/payments/', { params });
}

export async function getFinanceReport(params?: any): Promise<any> {
  return await adminDataClient.get('/finance/reports/', { params });
}

export async function getAllPayments(params: any = {}): Promise<any[]> {
  const firstPage = await getPayments(params);
  const results = firstPage.results ? [...firstPage.results] : (Array.isArray(firstPage) ? [...firstPage] : []);
  
  if (!firstPage.count) return results;

  const actualPageSize = results.length;
  if (actualPageSize === 0 || firstPage.count <= actualPageSize) {
    return results;
  }

  const totalPages = Math.ceil(firstPage.count / actualPageSize);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getPayments({ ...params, page: i }));
    }
    const subsequentPages = await Promise.all(promises);
    for (const page of subsequentPages) {
      if (page.results) {
        results.push(...page.results);
      }
    }
  }

  return results;
}

export async function getDeposits(params?: any): Promise<any> {
  return await adminDataClient.get('/finance/deposits/', { params });
}

export async function getDepositStats(params?: any): Promise<any> {
  return await adminDataClient.get('/finance/deposits/stats/', { params });
}

export async function getAllDeposits(params: any = {}): Promise<any[]> {
  const firstPage = await getDeposits(params);
  const results = firstPage.results ? [...firstPage.results] : (Array.isArray(firstPage) ? [...firstPage] : []);
  
  if (!firstPage.count) return results;

  const actualPageSize = results.length;
  if (actualPageSize === 0 || firstPage.count <= actualPageSize) {
    return results;
  }

  const totalPages = Math.ceil(firstPage.count / actualPageSize);
  
  if (totalPages > 1) {
    const promises = [];
    for (let i = 2; i <= totalPages; i++) {
      promises.push(getDeposits({ ...params, page: i }));
    }
    const subsequentPages = await Promise.all(promises);
    for (const page of subsequentPages) {
      if (page.results) {
        results.push(...page.results);
      }
    }
  }

  return results;
}
