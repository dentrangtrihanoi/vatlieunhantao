import { XIcon, SearchIcon } from "@/assets/icons";
import { useEffect, useRef, useState } from "react";
import Results from "./Results";
import SearchFilter from "./SearchFilter";

const GlobalSearchModal = (props: any) => {
  const { searchModalOpen, setSearchModalOpen } = props;
  const [filterValue, setFilterValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // handle ClickOutside
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSearchModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSearchModalOpen]);

  // Search Logic with Debounce
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=${filterValue}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm, filterValue]);

  // Clear results when modal closes
  useEffect(() => {
    if (!searchModalOpen) {
      setSearchTerm("");
      setResults([]);
    }
  }, [searchModalOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <>
      {searchModalOpen ? (
        <div
          className={`backdrop-filter-sm visible fixed left-0 top-0 z-[99999] flex min-h-screen w-full justify-center bg-[#000]/40 px-4 py-8 sm:px-8`}
        >
          <div
            ref={ref}
            className="relative w-full max-w-4xl transition-all transform scale-100 bg-white shadow-7 rounded-3xl"
          >
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute -right-5 -top-5 z-[9999] flex h-11.5 w-11.5 items-center justify-center rounded-full border-2 border-white bg-white hover:text-blue text-dark shadow-md"
            >
              <XIcon width={24} height={24} />
            </button>

            <div className="h-auto max-h-[calc(100vh-70px)] overflow-y-auto rounded-3xl bg-white">
              {/* Search Input Area */}
              <div className="p-10 pb-7">
                <div className="relative">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleChange}
                      placeholder="Nhập từ khóa tìm kiếm..."
                      className="flex h-[56px] w-full items-center rounded-lg border border-gray-3 pl-12 pr-6 outline-hidden duration-300 focus:border-blue text-lg"
                      autoFocus
                    />
                    <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center pointer-events-none">
                      <SearchIcon width={24} height={24} />
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-0 top-0 w-[56px] h-[56px] flex items-center justify-center hover:text-red-500"
                      >
                        <XIcon width={20} height={20} />
                      </button>
                    )}
                  </form>
                </div>
              </div>

              <SearchFilter
                filterValue={filterValue}
                setFilterValue={setFilterValue}
              />

              <div className="bg-white p-10 pt-7.5">
                {loading ? (
                  <div className="flex justify-center p-4 text-gray-500">Đang tìm kiếm...</div>
                ) : (
                  <div className="flex flex-wrap -mx-4">
                    <Results
                      {...props}
                      filterValue={filterValue}
                      results={results}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GlobalSearchModal;
