import PrivateRoute from "@/components/auth/PrivateRoute";
import ClubList from "@/components/club/ClubList";

export default function ClubsPage() {
  return <PrivateRoute>
    <div>
    <ClubList/>
  </div>
  </PrivateRoute>;
}
