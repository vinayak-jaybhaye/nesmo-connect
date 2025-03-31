import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dbServices from "../firebase/firebaseDb";
import { useSelector } from "react-redux";
import {
  Search,
  User,
  FileText,
  Briefcase,
  Award,
  Users,
  MessageSquare,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  // State for search results and UI
  const [searchTerm, setSearchTerm] = useState(query);
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Results state
  const [results, setResults] = useState({
    users: [],
    posts: [],
    opportunities: [],
    achievements: [],
    communities: [],
  });

  // Filters state
  const [filters, setFilters] = useState({
    sortBy: "relevance",
    dateRange: "anytime",
    userType: "all",
  });

  // Total count of all results
  const totalResults = Object.values(results).reduce(
    (sum, section) => sum + section.length,
    0
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Submit search form
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      performSearch(searchTerm.trim());
    }
  };

  // Update URL when filters change
  const updateUrlWithFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeTab !== "all") params.set("tab", activeTab);
    if (filters.sortBy !== "relevance") params.set("sort", filters.sortBy);
    if (filters.dateRange !== "anytime") params.set("date", filters.dateRange);
    if (filters.userType !== "all") params.set("type", filters.userType);

    navigate(`/search?${params.toString()}`, { replace: true });
  };

  // Perform search with current query and filters
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call your search API here
      // For now, we'll use mock data

      // Simulate API delay
      const searchResults = await dbServices.search(searchQuery);
      delete searchResults.lastVisible;

      // console.log(searchResults);

      // Mock search results
      const mockResults = {
        users: [
          {
            id: "1",
            name: "John Doe",
            avatarUrl: "/placeholder.svg?height=80&width=80",
            role: "Student",
            school: "Harvard University",
          },
          {
            id: "2",
            name: "Jane Smith",
            avatarUrl: "/placeholder.svg?height=80&width=80",
            role: "Alumni",
            school: "MIT",
          },
          {
            id: "3",
            name: "Robert Johnson",
            avatarUrl: "/placeholder.svg?height=80&width=80",
            role: "Student",
            school: "Stanford University",
          },
        ],
        posts: [
          {
            id: "1",
            title: "Latest Tech Trends",
            content:
              "Exploring the future of technology and its impact on education...",
            author: "Alex Johnson",
            authorId: "4",
            createdAt: new Date(Date.now() - 86400000),
            likes: 24,
            comments: 8,
          },
          {
            id: "2",
            title: "Networking Event Next Week",
            content:
              "Join us for a networking event with industry professionals...",
            author: "Sarah Williams",
            authorId: "5",
            createdAt: new Date(Date.now() - 172800000),
            likes: 42,
            comments: 15,
          },
        ],
        opportunities: [
          {
            id: "1",
            title: "Summer Internship Program",
            company: "Google",
            location: "Remote",
            deadline: new Date(Date.now() + 1209600000),
            type: "Internship",
          },
          {
            id: "2",
            title: "Research Assistant Position",
            company: "Stanford Research Lab",
            location: "Palo Alto, CA",
            deadline: new Date(Date.now() + 604800000),
            type: "Part-time",
          },
        ],
        achievements: [
          {
            id: "1",
            title: "Outstanding Research Award",
            recipient: "Maria Garcia",
            date: new Date(Date.now() - 2592000000),
            category: "Research",
          },
          {
            id: "2",
            title: "Hackathon Winner",
            recipient: "Team Innovators",
            date: new Date(Date.now() - 7776000000),
            category: "Technology",
          },
        ],
        communities: [
          {
            id: "1",
            name: "Tech Enthusiasts",
            members: 120,
            description: "A community for technology lovers and innovators",
          },
          {
            id: "2",
            name: "Research Network",
            members: 85,
            description: "Connect with fellow researchers and share insights",
          },
        ],
      };

      // Filter results based on search query
      const filteredResults = Object.entries(searchResults).reduce(
        (acc, [key, items]) => {
          if (!Array.isArray(items)) {
            console.error(`Expected an array for key: ${key}, but got:`, items);
            acc[key] = []; // Ensure it's an empty array if invalid
            return acc;
          }

          acc[key] = items.filter((item) => {
            const searchableText = JSON.stringify(item).toLowerCase();
            return searchableText.includes(searchQuery.toLowerCase());
          });

          return acc;
        },
        {}
      );

      setResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters to results
  const applyFilters = () => {
    updateUrlWithFilters();
    performSearch(query);
  };

  // Reset filters to defaults
  const resetFilters = () => {
    setFilters({
      sortBy: "relevance",
      dateRange: "anytime",
      userType: "all",
    });
    setActiveTab("all");
  };

  // Load search results when component mounts or query changes
  useEffect(() => {
    if (query) {
      setSearchTerm(query);
      performSearch(query);

      // Set active tab from URL if present
      const tabParam = searchParams.get("tab");
      if (
        tabParam &&
        [
          "all",
          "users",
          "posts",
          "opportunities",
          "achievements",
          "communities",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }

      // Set filters from URL if present
      const sortParam = searchParams.get("sort");
      const dateParam = searchParams.get("date");
      const typeParam = searchParams.get("type");

      const newFilters = { ...filters };
      if (sortParam) newFilters.sortBy = sortParam;
      if (dateParam) newFilters.dateRange = dateParam;
      if (typeParam) newFilters.userType = typeParam;

      setFilters(newFilters);
    }
  }, [query]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Unknown";

    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get visible results based on active tab
  const getVisibleResults = () => {
    if (activeTab === "all") {
      return results;
    }

    return {
      [activeTab]: results[activeTab] || [],
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for users, posts, opportunities..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-12 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-300"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </form>

          {query && (
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm sm:text-base">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></span>
                    Searching...
                  </span>
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : (
                  <span>
                    Found{" "}
                    <span className="text-white font-semibold">
                      {totalResults}
                    </span>{" "}
                    results for{" "}
                    <span className="text-white font-semibold">"{query}"</span>
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {query && !isLoading && !error && (
          <>
            {/* Tabs and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Tabs */}
              <div className="flex overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mr-2 whitespace-nowrap text-sm ${
                    activeTab === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  All Results
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mr-2 whitespace-nowrap text-sm ${
                    activeTab === "users"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Users ({results.users.length})
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mr-2 whitespace-nowrap text-sm ${
                    activeTab === "posts"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Posts ({results.posts.length})
                </button>
                <button
                  onClick={() => setActiveTab("opportunities")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mr-2 whitespace-nowrap text-sm ${
                    activeTab === "opportunities"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Opportunities ({results.opportunities.length})
                </button>
                <button
                  onClick={() => setActiveTab("communities")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg mr-2 whitespace-nowrap text-sm ${
                    activeTab === "communities"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Communities ({results.communities.length})
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm"
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="recent">Most Recent</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters({ ...filters, dateRange: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="anytime">Anytime</option>
                      <option value="today">Today</option>
                      <option value="week">Past Week</option>
                      <option value="month">Past Month</option>
                      <option value="year">Past Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">
                      User Type
                    </label>
                    <select
                      value={filters.userType}
                      onChange={(e) =>
                        setFilters({ ...filters, userType: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students</option>
                      <option value="alumni">Alumni</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-3 sm:mt-4 gap-2 sm:gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-8">
              {totalResults === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gray-800 rounded-lg p-6 sm:p-8 max-w-md mx-auto">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base">
                      We couldn't find any matches for "{query}". Try adjusting
                      your search terms or filters.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                Object.entries(getVisibleResults()).map(([section, items]) => {
                  if (items.length === 0) return null;

                  return (
                    <div key={section} className="mb-8">
                      {activeTab === "all" && (
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h2 className="text-lg sm:text-xl font-semibold capitalize flex items-center">
                            {section === "users" && (
                              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-indigo-400" />
                            )}
                            {section === "posts" && (
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-400" />
                            )}
                            {section === "opportunities" && (
                              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-green-400" />
                            )}
                            {section === "achievements" && (
                              <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-yellow-400" />
                            )}
                            {section === "communities" && (
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-purple-400" />
                            )}
                            {section}
                          </h2>
                          {items.length > 3 && (
                            <button
                              onClick={() => setActiveTab(section)}
                              className="text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm flex items-center"
                            >
                              View all ({items.length})
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render different result types */}
                      {section === "users" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {(activeTab === "all"
                            ? items.slice(0, 3)
                            : items
                          ).map((user) => (
                            <div
                              key={user.id}
                              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                              onClick={() => navigate(`/profile/${user.id}`)}
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 border-2 border-gray-600">
                                  <img
                                    src={user.avatarUrl || "/avatar.png"}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base sm:text-lg">
                                    {user.name}
                                  </h3>
                                  <p className="text-gray-400 text-xs sm:text-sm">
                                    {user?.userRole}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">
                                    {user?.personalData.school}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section === "posts" && (
                        <div className="space-y-3 sm:space-y-4">
                          {(activeTab === "all"
                            ? items.slice(0, 3)
                            : items
                          ).map((post) => (
                            <div
                              key={post.id}
                              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex justify-between items-center text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <span className="hidden xs:inline">By </span>
                                  <span
                                    className="text-indigo-400 hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/profile/${post.authorId}`);
                                    }}
                                  >
                                    {post.author}
                                  </span>
                                  <span className="mx-1 sm:mx-2">•</span>
                                  <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <span className="flex items-center gap-1">
                                    <svg
                                      className="h-3 w-3 sm:h-4 sm:w-4 text-red-500"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {post.likes}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {post.comments}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section === "opportunities" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {(activeTab === "all"
                            ? items.slice(0, 2)
                            : items
                          ).map((opportunity) => (
                            <div
                              key={opportunity.id}
                              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(`/opportunity/${opportunity.id}`)
                              }
                            >
                              <div className="flex justify-between items-start mb-1 sm:mb-2">
                                <h3 className="font-semibold text-base sm:text-lg">
                                  {opportunity.title}
                                </h3>
                                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-900/50 text-green-400 rounded text-xs">
                                  {opportunity.type}
                                </span>
                              </div>
                              <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
                                {opportunity.company}
                              </p>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 flex items-center gap-1">
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {opportunity.location}
                                </span>
                                <span className="text-yellow-500">
                                  Deadline: {formatDate(opportunity.deadline)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section === "achievements" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {(activeTab === "all"
                            ? items.slice(0, 2)
                            : items
                          ).map((achievement) => (
                            <div
                              key={achievement.id}
                              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(`/achievement/${achievement.id}`)
                              }
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-yellow-900/30 rounded-full">
                                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-base sm:text-lg">
                                    {achievement.title}
                                  </h3>
                                  <p className="text-gray-300 text-xs sm:text-sm">
                                    Awarded to: {achievement.recipient}
                                  </p>
                                  <div className="flex justify-between items-center mt-1.5 sm:mt-2 text-xs text-gray-400">
                                    <span>{formatDate(achievement.date)}</span>
                                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-700 rounded">
                                      {achievement.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section === "communities" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {(activeTab === "all"
                            ? items.slice(0, 3)
                            : items
                          ).map((community) => (
                            <div
                              key={community.id}
                              className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(`/community/${community.id}`)
                              }
                            >
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <h3 className="font-semibold text-base sm:text-lg">
                                  {community.name}
                                </h3>
                                <span className="text-xs text-gray-400 flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {community.members}
                                </span>
                              </div>
                              <p className="text-gray-300 text-xs sm:text-sm">
                                {community.description}
                              </p>
                              <div className="mt-3 sm:mt-4 flex justify-end">
                                <button
                                  className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle join community
                                  }}
                                >
                                  Join Community
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* View more button for each section */}
                      {activeTab === section && items.length > 6 && (
                        <div className="mt-4 sm:mt-6 text-center">
                          <button className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm">
                            Load More
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Initial state - no search performed yet */}
        {!query && (
          <div className="text-center py-12 sm:py-16">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Search for anything
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              Find users, posts, opportunities, communities and more by entering
              your search terms above.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => navigate("/users")}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Browse Users
              </button>
              <button
                onClick={() => navigate("/communities")}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Explore Communities
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">
                Searching for "{query}"...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
