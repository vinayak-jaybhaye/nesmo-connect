import { useEffect, useState } from "react";
import dbServices from "../firebase/firebaseDb";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortOrder, setSortOrder] = useState("desc");

  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (user?.userRole !== "admin") {
      window.location.href = "/";
    }
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const { users } = await dbServices.fetchPendingUsers();
      // console.log(users);
      setPendingUsers(users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const confirmAction = (type, userId) => {
    setActionType(type);
    setActionUserId(userId);
    setConfirmDialogOpen(true);
  };

  const handleAccept = async (userId) => {
    setConfirmDialogOpen(false);
    try {
      await dbServices.acceptPendingUser(userId);

      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setRemarks((prev) => {
        const newRemarks = { ...prev };
        delete newRemarks[userId]; // Clear remark
        return newRemarks;
      });
    } catch (error) {
      console.error("Error accepting user:", error);
      setError("Failed to accept user.");
    }
  };

  const handleReject = async (userId) => {
    setConfirmDialogOpen(false);
    const remark = remarks[userId] || "No reason provided.";

    try {
      await dbServices.rejectPendingUser(userId, remark);
      setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      setRemarks((prev) => {
        const newRemarks = { ...prev };
        delete newRemarks[userId]; // Clear remark after rejection
        return newRemarks;
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      setError("Failed to reject user.");
    }
  };

  const filteredUsers = pendingUsers
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name?.localeCompare(b.name || "")
          : b.name?.localeCompare(a.name || "");
      } else if (sortBy === "role") {
        return sortOrder === "asc"
          ? a.userRole?.localeCompare(b.userRole || "")
          : b.userRole?.localeCompare(a.userRole || "");
      } else {
        // Default to date sorting
        const dateA = a.dateCreated?.toDate?.() || new Date();
        const dateB = b.dateCreated?.toDate?.() || new Date();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (timestamp) => {
    return dbServices.formatFirebaseTimestamp(timestamp);
  };

  return (
    <div className="h-[90vh] w-full bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">NESMO CONNECT Admin</h1>
          <p className="text-gray-400">Manage pending user applications</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Pending Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve new user registrations
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />

                <div className="flex gap-2 justify-center items-center">
                  <select
                    className="bg-gray-700 border border-gray-600 rounded-md  px-3 py-2 text-sm"
                    onDrop={(e) => e.preventDefault()}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="dateCreated">Date</option>
                    <option value="name">Name</option>
                    <option value="role">Role</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600"
                    onClick={fetchPendingUsers}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
                <p className="text-gray-400">Loading pending users...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-400">
                <AlertCircle className="h-8 w-8 mb-4" />
                <p>{error}</p>
                <Button
                  variant="outline"
                  className="mt-4 border-gray-600"
                  onClick={fetchPendingUsers}
                >
                  Try Again
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <CheckCircle className="h-8 w-8 mb-4" />
                <p>No pending users to review</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="bg-gray-700 border-gray-600">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Avatar className="h-10 w-10 bg-indigo-600">
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                            {user?.avatarUrl && (
                              <AvatarImage
                                src={user?.avatarUrl}
                                alt={user.name}
                              />
                            )}
                          </Avatar>
                          <div className="flex flex-col overflow-hidden">
                            <CardTitle className="text-lg animate-marquee sm:animate-none">
                              {user.name || "Unnamed User"}
                            </CardTitle>
                            <CardDescription className="text-gray-400 animate-marquee sm:animate-none">
                              {user.email}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600 hover:bg-yellow-700">
                          <span>
                            <Clock className="w-3 h-3 mr-1" />
                          </span>
                          <span className="hidden md:block">
                            {user?.userVerificationStatus?.toUpperCase() ||
                              "PENDING"}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>
                            {user.userRole?.toUpperCase() || "No role"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Textarea
                          placeholder="Add remarks for this application..."
                          className="w-full bg-gray-800 border-gray-600 text-white text-sm"
                          value={remarks[user.id] || ""}
                          onChange={(e) =>
                            setRemarks((prev) => ({
                              ...prev,
                              [user.id]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                        onClick={() => handleViewProfile(user)}
                      >
                        View Profile
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => confirmAction("accept", user.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="hidden md:block">Accept</span>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => confirmAction("reject", user.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          <span className="hidden md:block">Reject</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* User Profile Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="bg-gray-800 rounded-lg text-white border-gray-700 max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">User Profile</DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information about the applicant
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile Header - Improved for mobile */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center mx-auto sm:mx-0">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 bg-indigo-600">
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                    {selectedUser?.avatarUrl && (
                      <AvatarImage
                        src={selectedUser?.avatarUrl}
                        alt={selectedUser.name}
                      />
                    )}
                  </Avatar>
                  <Badge className="mt-3 bg-yellow-600">Pending Review</Badge>
                </div>

                <div className="flex-1 space-y-4 text-center sm:text-left mt-4 sm:mt-0">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold">
                      {selectedUser.name || "Unnamed User"}
                    </h3>
                    <p className="text-gray-400 break-all inline-block">
                      {selectedUser.email}
                    </p>
                  </div>

                  {/* Responsive grid that collapses to single column on very small screens */}
                  <div className="grid grid-cols-2 xs:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1 p-2 bg-gray-800/50 rounded-md">
                      <p className="text-gray-400 text-xs">Role</p>
                      <p>
                        {selectedUser.userRole?.toUpperCase() ||
                          "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1 p-2 bg-gray-800/50 rounded-md">
                      <p className="text-gray-400 text-xs">Applied On</p>
                      <p>{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div className="space-y-1 p-2 bg-gray-800/50 rounded-md">
                      <p className="text-gray-400 text-xs">Organization</p>
                      <p
                        className="truncate"
                        title={selectedUser.organization || "Not specified"}
                      >
                        {selectedUser.personalData.school || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1 p-2 bg-gray-800/50 rounded-md">
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p>
                        {selectedUser?.personalData?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-800/50 p-3 rounded-md">
                <h4 className="font-medium mb-2 text-sm text-gray-300">
                  About
                </h4>
                <p className="text-gray-300 text-sm">
                  {selectedUser?.personalData?.about ||
                    selectedUser.about ||
                    "No additional information provided."}
                </p>
              </div>

              {/* Additional Info Section - Only show if exists */}
              {selectedUser.additionalInfo && (
                <div className="bg-gray-800/50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-sm text-gray-300">
                    Additional Information
                  </h4>
                  <div className="bg-gray-700 p-3 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap font-sans overflow-auto max-h-32">
                      {selectedUser.additionalInfo}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tabs - Made more touch-friendly */}
              <Tabs defaultValue="remarks">
                <TabsList className="bg-gray-700 w-full">
                  <TabsTrigger value="remarks" className="flex-1">
                    Remarks
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="remarks" className="border-none p-0 mt-4">
                  <Textarea
                    placeholder="Add remarks about this application..."
                    className="w-full bg-gray-700 border-gray-600 text-white"
                    value={remarks[selectedUser.id] || ""}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [selectedUser.id]: e.target.value,
                      }))
                    }
                    rows={4}
                  />
                </TabsContent>

                <TabsContent value="documents" className="border-none p-0 mt-4">
                  <div className="bg-gray-700 p-4 rounded-md text-gray-400">
                    {selectedUser.documents?.length ? (
                      <ul className="text-left">
                        {selectedUser.documents.map((doc, index) => (
                          <li key={index} className="mb-2 flex items-center">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:underline flex items-center"
                            >
                              <span className="mr-2">📄</span>
                              <span className="truncate">
                                {doc.name || `Document ${index + 1}`}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center">
                        No documents uploaded by this user
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="border-none p-0 mt-4">
                  <div className="bg-gray-700 p-4 rounded-md text-center text-gray-400">
                    <p>No previous application history</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-600">
                Close
              </Button>
            </DialogClose>

            <div className="flex justify-between space-x-2 mb-2 sm:mb-0">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setUserDialogOpen(false);
                  confirmAction("accept", selectedUser?.id);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept User
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setUserDialogOpen(false);
                  confirmAction("reject", selectedUser?.id);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject User
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept"
                ? "Accept User Application"
                : "Reject User Application"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {actionType === "accept"
                ? "This will approve the user and grant them access to the platform."
                : "This will reject the user application. They will be notified with your remarks."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {actionType === "reject" && (
            <div className="my-2">
              <p className="text-sm mb-2">Rejection remarks:</p>
              <div className="bg-gray-700 p-2 rounded-md text-sm max-h-24 overflow-y-auto">
                {remarks[actionUserId] || "No reason provided."}
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                actionType === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
              onClick={() =>
                actionType === "accept"
                  ? handleAccept(actionUserId)
                  : handleReject(actionUserId)
              }
            >
              {actionType === "accept" ? "Yes, Accept" : "Yes, Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminDashboard;
