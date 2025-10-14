import { useQuery } from "@tanstack/react-query";
import { fetchUserReports } from "../../api/reportapi";

export const useReports = () => {
    return useQuery({
        queryKey: ["userReports"],
        queryFn: fetchUserReports,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    })
}