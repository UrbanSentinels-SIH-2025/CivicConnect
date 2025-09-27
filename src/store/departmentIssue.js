import { create } from "zustand";

const useDepartmentIssueStore = create((set) => ({
        // current active department
  departmentIssues: [],              // issues for that department

  // Set current department and its issues
  setDepartment: (departmentIssues) =>
    set(() => ({
       departmentIssues,
    })),

}));
export default useDepartmentIssueStore;