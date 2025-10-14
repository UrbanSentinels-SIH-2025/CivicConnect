import api from "./axios";


export const fetchUserReports = async () => {
  const res = await api.get("/user-issue");
  return res.data.issues; 
};

export const fetchOthersReports=async()=>{
  const res=await api.get("/user-issue/other-issues");
  return res.data;
}