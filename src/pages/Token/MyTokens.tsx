import { useState } from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { motion } from "framer-motion"

const data = [
  { id: 1, name: "Öğe 1", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 2, name: "Öğe 2", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 3, name: "Öğe 3", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 4, name: "Öğe 4", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 5, name: "Öğe 5", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 6, name: "Öğe 6", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 7, name: "Öğe 7", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 8, name: "Öğe 8", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 9, name: "Öğe 9", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 10, name: "Öğe 10", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 11, name: "Öğe 11", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 12, name: "Öğe 12", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 13, name: "Öğe 13", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 14, name: "Öğe 14", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
  { id: 151231, name: "Öğe 11231235", column1: "Değer 1", column2: "Değer 2", column3: "Değer 3", column4: "Değer 4", column5: "Değer 5" },
];

const itemsPerPage = 5; // Her sayfa için gösterilecek öğe sayısı

const MyTokens = () => {
  const paginationVariants = {
    hidden: {
      opacity: 0,
      y: 200,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1,
      }
    }
  }
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center text-3xl py-16">
        <div className="inline relative">
          <span className="text-navy-blue">List Of My Tokens</span>
          <div className="border-t border-black absolute w-full left-1/2 transform -translate-x-1/2 mt-2"></div>
        </div>
      </div>
      <div className="relative w-full flex flex-col justify-center items-center mb-6">
        <div className="block bg-transparent w-full">
          <div className="flex justify-center items-center">
            <div className="w-1/2 sm:w-3/4 xs:w-full overflow-x-auto">
              <table className="w-full">
                <thead className="text-white text-left bg-navy-blue">
                  <tr>
                    <th className="px-6 py-3 text-md">ID</th>
                    <th className="px-6 py-3 text-md">Name</th>
                    <th className="px-6 py-3 text-md">Column 1</th>
                    <th className="px-6 py-3 text-md">Column 2</th>
                    <th className="px-6 py-3 text-md">Column 3</th>
                    <th className="px-6 py-3 text-md">Column 4</th>
                    <th className="px-6 py-3 text-md">Column 5</th>
                  </tr>
                </thead>
                <tbody className="text-black text-left">
                    {currentPageData.map((item) => (
                      <tr key={item.id} className="bg-white hover:bg-blue hover:text-white">
                        <td className="px-6 py-3 text-md">{item.id}</td>
                        <td className="px-6 py-3 text-md">{item.name}</td>
                        <td className="px-6 py-3 text-md">{item.column1}</td>
                        <td className="px-6 py-3 text-md">{item.column2}</td>
                        <td className="px-6 py-3 text-md">{item.column3}</td>
                        <td className="px-6 py-3 text-md">{item.column4}</td>
                        <td className="px-6 py-3 text-md">{item.column5}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <motion.div
            variants={paginationVariants}
            initial="hidden"
            animate="visible"
          >
            <ReactPaginate
              breakLabel={<span className="mr-4">...</span>}
              nextLabel={
                <span className="w-10 h-10 flex justify-center items-center bg-lightGray rounded-md">
                  <BsChevronRight />
                </span>
              }
              previousLabel={
                <span className="w-10 h-10 flex justify-center items-center bg-lightGray rounded-md mr-4">
                  <BsChevronLeft />
                </span>
              }
              containerClassName="flex justify-center items-center mt-8 mb-4"
              pageClassName="block border-solid w-10 h-10 flex justify-center items-center rounded-md mr-4"
              pageRangeDisplayed={3}
              pageCount={Math.ceil(data.length / itemsPerPage)}
              activeClassName="bg-navy-blue text-white"
              onPageChange={handlePageClick}
            />
          </motion.div>
      </div>

  </div>
  )
};

export default MyTokens;
