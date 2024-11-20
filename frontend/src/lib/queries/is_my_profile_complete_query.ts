import { useQuery } from "@tanstack/react-query";
import { getMyUserData, isMyProfileComplete, Tags } from "../api/requests";

export const isMyProfileCompleteQuery = () => useQuery({
    queryKey: ['isMyProfileComplete'],
    queryFn: () => isMyProfileComplete(),
});