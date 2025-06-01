import axiosClient from "./axiosClient";

const getOverview = async () => {
  const response = await axiosClient.get('/api/v1/admin/analytics/overview');
  return response;
};

const getUserStatsRes = async (startDate) => {
  const response = await axiosClient.get('/api/v1/admin/analytics/users', {
    params: { startDate },
  });
  return response;
};

const getRevenueRes = async (startDate, endDate) => {
  console.log("check date", startDate, " ", endDate)
  // const response = await axiosClient.get('/api/v1/admin/analytics/revenue', {
  //   params: {
  //     startDate,
  //     endDate,
  //     periodType: 'MONTH',
  //   },
  // });
  // return response;
};

export {
  getOverview,
  getUserStatsRes,
  getRevenueRes,
};