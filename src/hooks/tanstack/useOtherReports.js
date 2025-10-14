import { useQuery } from "@tanstack/react-query";
import { fetchOthersReports } from "../../api/reportapi";

export const useOtherReports=()=>{
    return useQuery({
        queryKey:["OthersReport"],
        queryFn:fetchOthersReports,
         staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}