import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronRight,
  ChevronUp,
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  BarChart3,
  Search,
  MapPin,
  Building2,
  FileText,
  Star,
  Image as ImageIcon,
  Smile,
  AlertTriangle,
  Calendar,
  History,
  ShieldCheck,
  Eye,
  ThumbsUp,
  Filter,
  X,
  Layers,
  MessageCircle,
  LayoutDashboard,
  ListFilter,
  CheckSquare,
  Square
} from 'lucide-react';

// --- Constants & Config ---

const ISSUE_CATEGORIES = [
  "ถนนและทางเท้า", "แสงสว่าง", "ความสะอาด/ขยะ", 
  "น้ำท่วม/ระบายน้ำ", "การจราจร", "ความปลอดภัย", "เสียงรบกวน", "สัตว์จรจัด"
];

const STANDARD_DEPARTMENTS = [
  "ฝ่ายปกครอง", "ฝ่ายทะเบียน", "ฝ่ายโยธา", "ฝ่ายสิ่งแวดล้อมและสุขาภิบาล",
  "ฝ่ายรายได้", "ฝ่ายรักษาความสะอาดฯ", "ฝ่ายการศึกษา", "ฝ่ายการคลัง",
  "ฝ่ายเทศกิจ", "ฝ่ายพัฒนาชุมชนฯ"
];

const DISTRICT_NAMES = [
  "พระนคร", "ดุสิต", "หนองจอก", "บางรัก", "บางเขน", "บางกะปิ", "ปทุมวัน", "ป้อมปราบศัตรูพ่าย", "พระโขนง", "มีนบุรี",
  "ลาดกระบัง", "ยานนาวา", "สัมพันธวงศ์", "พญาไท", "ธนบุรี", "บางกอกใหญ่", "ห้วยขวาง", "คลองสาน", "ตลิ่งชัน", "บางกอกน้อย",
  "บางขุนเทียน", "ภาษีเจริญ", "หนองแขม", "ราษฎร์บูรณะ", "บางพลัด", "ดินแดง", "บึงกุ่ม", "สาทร", "บางซื่อ", "จตุจักร",
  "บางคอแหลม", "ประเวศ", "คลองเตย", "สวนหลวง", "จอมทอง", "ดอนเมือง", "ราชเทวี", "ลาดพร้าว", "วัฒนา", "บางแค",
  "หลักสี่", "สายไหม", "คันนายาว", "สะพานสูง", "วังทองหลาง", "คลองสามวา", "บางนา", "ทวีวัฒนา", "ทุ่งครุ", "บางบอน"
];

const COMMENTS_LIST = [
    "เจ้าหน้าที่บริการดีมากครับ",
    "รวดเร็วทันใจ ขอบคุณครับ",
    "แก้ไขเรียบร้อยดี",
    "อยากให้มาเร็วกว่านี้หน่อย",
    "สุภาพ พูดจาดี",
    "ขอบคุณที่ช่วยดูแลครับ",
    "พื้นที่สะอาดขึ้นมาก",
    "ไฟสว่างแล้ว ขอบคุณค่ะ"
];

// --- Mock Data Generation ---

const generateData = () => {
  const today = new Date();
  
  return DISTRICT_NAMES.map((distName, distIndex) => {
    const departments = STANDARD_DEPARTMENTS.map((deptName, deptIndex) => {
      
      const isTargetDept = distName === "ราษฎร์บูรณะ" && deptName === "ฝ่ายสิ่งแวดล้อมและสุขาภิบาล";
      const issueCount = isTargetDept ? 15 : Math.floor(Math.random() * 20) + 5; 
      
      const issues = Array.from({ length: issueCount }, (_, i) => {
        let rand = Math.random();
        let status = 'completed';
        let reopenCount = 0;
        let rating = 0;
        let comment = null;
        let dateOffset = Math.floor(Math.random() * 90); 

        if (isTargetDept && i < 5) {
            status = 'completed';
            rating = i + 1; 
            dateOffset = i * 20; 
            if (rating >= 4) comment = COMMENTS_LIST[i % COMMENTS_LIST.length];
        } else {
            if (rand > 0.85) { status = 'reopened'; reopenCount = Math.floor(Math.random() * 3) + 1; }
            else if (rand > 0.7) { status = 'in_progress'; }
            else if (rand > 0.55) { status = 'pending'; }
            else if (rand <= 0.55 && Math.random() > 0.8) { reopenCount = Math.floor(Math.random() * 2) + 1; } 

            rating = status === 'reopened' ? 0 : (status === 'completed' ? Math.floor(Math.random() * 3) + 3 : 0);
            if (rating >= 4 && Math.random() > 0.5) {
                comment = COMMENTS_LIST[Math.floor(Math.random() * COMMENTS_LIST.length)];
            }
        }

        const views = Math.floor(Math.random() * 5000) + 50;
        const votes = Math.floor(Math.random() * 500) + 5;
        const category = ISSUE_CATEGORIES[Math.floor(Math.random() * ISSUE_CATEGORIES.length)];

        const reportDateObj = new Date(today);
        reportDateObj.setDate(today.getDate() - dateOffset);
        const reportDateStr = reportDateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'});

        const lastUpdateObj = new Date(reportDateObj);
        lastUpdateObj.setDate(reportDateObj.getDate() + Math.floor(Math.random() * 5));
        const lastUpdateStr = lastUpdateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'});

        return {
          id: `${distIndex}${deptIndex}${i}`,
          ticketId: `BMA-${distIndex}-${deptIndex}-${i}`,
          topic: `แจ้งปัญหา${category} จุดที่ ${i + 1}`,
          deptName: deptName,
          category: category,
          status: status,
          reportDate: reportDateStr,
          lastUpdate: lastUpdateStr,
          reportDateObj: reportDateObj, 
          reopenCount: reopenCount,
          rating: rating,
          comment: comment,
          views: views,
          votes: votes,
          imageUrl: `https://picsum.photos/seed/${distIndex}${deptIndex}${i}/400/300`
        };
      });

      return {
        id: `DEPT-${distIndex}-${deptIndex}`,
        name: deptName,
        issues: issues
      };
    });

    return {
      id: `DIST-${distIndex}`,
      name: `เขต${distName}`,
      departments: departments
    };
  });
};

const rawData = generateData();

// --- Components ---

const MultiSelectDropdown = ({ label, options, selected, onChange, placeholder = "เลือก...", enableSearch = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleSelectAll = () => {
    if (searchTerm) {
        const allVisibleSelected = filteredOptions.every(opt => selected.includes(opt));
        if (allVisibleSelected) {
            onChange(selected.filter(item => !filteredOptions.includes(item)));
        } else {
            const newSelected = [...new Set([...selected, ...filteredOptions])];
            onChange(newSelected);
        }
    } else {
        if (selected.length === options.length) {
            onChange([]);
        } else {
            onChange([...options]);
        }
    }
  };

  const getSelectAllText = () => {
      if (searchTerm) {
          const allVisibleSelected = filteredOptions.length > 0 && filteredOptions.every(opt => selected.includes(opt));
          return allVisibleSelected ? 'ยกเลิกที่ค้นหา' : 'เลือกที่ค้นหาทั้งหมด';
      }
      return selected.length === options.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm text-slate-600 font-medium mb-1.5">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm flex justify-between items-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
      >
        <span className="truncate block pr-4 text-slate-700">
          {selected.length === 0 ? placeholder : 
           selected.length === options.length ? `ทั้งหมด (${options.length})` : 
           `${selected.length} รายการ`}
        </span>
        <ChevronDown size={20} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-hidden flex flex-col">
           {enableSearch && (
             <div className="p-2 border-b border-slate-100 bg-slate-50">
               <div className="relative">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                    type="text" 
                    placeholder="ค้นหา..." 
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                 />
               </div>
             </div>
           )}

           <div className="overflow-y-auto">
             <div 
                onClick={handleSelectAll}
                className="px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 text-sm font-semibold text-indigo-600 flex items-center gap-2 sticky top-0 bg-white"
              >
                {(!searchTerm && selected.length === options.length) || (searchTerm && filteredOptions.every(opt => selected.includes(opt)) && filteredOptions.length > 0) ? (
                    <CheckSquare size={16} />
                ) : (
                    <Square size={16} />
                )}
                {getSelectAllText()}
             </div>
            {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleToggle(option)}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 border-b border-slate-50 last:border-0"
                >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.includes(option) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {selected.includes(option) && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    {option}
                </div>
                ))
            ) : (
                <div className="p-4 text-center text-sm text-slate-400">ไม่พบข้อมูล</div>
            )}
           </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [dateRange, setDateRange] = useState('this_month'); 
  const [statType, setStatType] = useState('satisfaction'); 
  const [selectedCategories, setSelectedCategories] = useState(ISSUE_CATEGORIES);
  const [selectedDistricts, setSelectedDistricts] = useState(DISTRICT_NAMES);
  const [selectedDepartments, setSelectedDepartments] = useState(STANDARD_DEPARTMENTS);
  const [viewMode, setViewMode] = useState('all'); 
  const [specificDistrict, setSpecificDistrict] = useState(DISTRICT_NAMES[0]);
  
  // New State for Mobile Filter Toggle
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const dateLabels = useMemo(() => {
    const today = new Date();
    const currentMonthName = today.toLocaleDateString('th-TH', { month: 'long' });
    
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthName = prevMonthDate.toLocaleDateString('th-TH', { month: 'long' });
    
    const twoMonthsAgoDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const twoMonthsAgoName = twoMonthsAgoDate.toLocaleDateString('th-TH', { month: 'long' });

    return {
        this_month: currentMonthName,
        last_month: prevMonthName,
        two_months_ago: twoMonthsAgoName
    };
  }, []);

  const filteredData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const baseFilter = (issues) => {
        return issues.filter(issue => {
            if (!selectedCategories.includes(issue.category)) return false;
            const issueDate = issue.reportDateObj;
            
            if (dateRange === 'this_month') {
                return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
            }
            if (dateRange === 'last_month') {
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const yearOfLastMonth = currentMonth === 0 ? currentYear - 1 : currentYear;
                return issueDate.getMonth() === lastMonth && issueDate.getFullYear() === yearOfLastMonth;
            }
            if (dateRange === 'two_months_ago') {
                const targetDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                const targetMonth = targetDate.getMonth();
                const targetYear = targetDate.getFullYear();
                return issueDate.getMonth() === targetMonth && issueDate.getFullYear() === targetYear;
            }
            return true;
        });
    };

    let processed = rawData.map(dist => {
        const filteredDepts = dist.departments
          .filter(dept => selectedDepartments.includes(dept.name))
          .map(dept => {
             const filteredIssues = baseFilter(dept.issues);
             
             let sortValue = 0;
             if (viewMode === 'all') {
                 const total = filteredIssues.length;
                 if (statType === 'reopened') {
                     const reopened = filteredIssues.filter(i => i.status === 'reopened').length;
                     sortValue = total > 0 ? (reopened / total) : -1;
                 } else if (statType === 'satisfaction') {
                     const rated = filteredIssues.filter(i => i.rating > 0);
                     sortValue = rated.length > 0 ? rated.reduce((a, b) => a + b.rating, 0) / rated.length : -1;
                 } else if (statType === 'resolved') {
                     sortValue = filteredIssues.filter(i => i.status === 'completed').length;
                 } else if (statType === 'most_viewed') {
                     sortValue = filteredIssues.reduce((a, b) => a + b.views, 0);
                 } else if (statType === 'most_voted') {
                     sortValue = filteredIssues.reduce((a, b) => a + b.votes, 0);
                 }
             }

             return { ...dept, issues: filteredIssues, sortValue };
          })
          .filter(dept => dept.issues.length > 0);

        if (viewMode === 'all') {
            filteredDepts.sort((a, b) => b.sortValue - a.sortValue);
        }

        let distSortValue = 0;
        if (viewMode === 'all') {
             const allIssues = filteredDepts.flatMap(d => d.issues);
             const totalDist = allIssues.length;
             if (statType === 'reopened') {
                 const reopened = allIssues.filter(i => i.status === 'reopened').length;
                 distSortValue = totalDist > 0 ? (reopened / totalDist) : -1;
             } else if (statType === 'satisfaction') {
                 const rated = allIssues.filter(i => i.rating > 0);
                 distSortValue = rated.length > 0 ? rated.reduce((a, b) => a + b.rating, 0) / rated.length : -1;
             } else {
                 distSortValue = filteredDepts.reduce((a, b) => a + b.sortValue, 0);
             }
        }

        return { ...dist, departments: filteredDepts, sortValue: distSortValue };
    });

    processed = processed.filter(dist => {
        if (viewMode === 'specific') {
            return dist.name === `เขต${specificDistrict}`; 
        }
        return selectedDistricts.includes(dist.name.replace('เขต', ''));
    }).filter(dist => dist.departments.length > 0);

    if (viewMode === 'all') {
        processed.sort((a, b) => b.sortValue - a.sortValue);
    }

    return processed;
  }, [dateRange, selectedCategories, selectedDistricts, selectedDepartments, viewMode, specificDistrict, statType]);

  const getTheme = () => {
    switch (statType) {
      case 'satisfaction': return { color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <Smile /> };
      case 'resolved': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <CheckCircle2 /> };
      case 'most_viewed': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <Eye /> };
      case 'most_voted': return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <ThumbsUp /> };
      case 'reopened': 
      default: return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: <RotateCcw /> };
    }
  };
  const theme = getTheme();

  const sortIssues = (issues) => {
    return [...issues].sort((a, b) => {
        if (statType === 'satisfaction') {
            if (a.comment && !b.comment) return -1;
            if (!a.comment && b.comment) return 1;
            return b.reportDateObj - a.reportDateObj;
        }
        if (statType === 'most_viewed') return b.views - a.views;
        if (statType === 'most_voted') return b.votes - a.votes;
        if (statType === 'reopened') return b.reopenCount - a.reopenCount;
        return b.reportDateObj - a.reportDateObj;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                   <LayoutDashboard size={24} />
                </div>
                <div>
                   <h1 className="font-bold text-xl text-slate-800 leading-tight">BMA Analytics</h1>
                   <p className="text-sm text-slate-500">ระบบติดตามและประเมินผล</p>
                </div>
             </div>

             <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex flex-wrap sm:flex-nowrap">
                <button 
                  onClick={() => setViewMode('all')}
                  className={`flex-1 px-4 sm:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${viewMode === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Layers size={16} /> ภาพรวม กทม.
                </button>
                <button 
                  onClick={() => setViewMode('specific')}
                  className={`flex-1 px-4 sm:px-6 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${viewMode === 'specific' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Building2 size={16} /> เขตของฉัน
                </button>
             </div>
          </div>
        </div>
      </header>

      <section className="bg-white border-b border-slate-200 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-0 sm:mb-5">
                <div className="flex items-center gap-2 text-base font-bold text-slate-800">
                    <ListFilter size={20} className="text-indigo-600" /> ตัวกรองข้อมูล (Filters)
                </div>
                {/* Toggle Button for Mobile */}
                <button 
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className="sm:hidden flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                    {isFiltersVisible ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'} 
                    {isFiltersVisible ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
            </div>
            
            {/* Conditional Rendering for Filters */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 ${isFiltersVisible ? 'block mt-4' : 'hidden sm:grid'}`}>
               <div className="lg:col-span-4">
                  <label className="block text-sm text-slate-600 font-medium mb-1.5">ช่วงเวลา</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                     <button onClick={() => setDateRange('this_month')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${dateRange === 'this_month' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-200/50'}`}>{dateLabels.this_month}</button>
                     <button onClick={() => setDateRange('last_month')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${dateRange === 'last_month' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-200/50'}`}>{dateLabels.last_month}</button>
                     <button onClick={() => setDateRange('two_months_ago')} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${dateRange === 'two_months_ago' ? 'bg-white text-indigo-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-200/50'}`}>{dateLabels.two_months_ago}</button>
                  </div>
               </div>

               {viewMode === 'all' && (
                   <div className="lg:col-span-4">
                      <label className="block text-sm text-slate-600 font-medium mb-1.5">ประเภทสถิติ</label>
                      <div className="relative">
                        <select 
                            value={statType} 
                            onChange={(e) => setStatType(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-base shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-indigo-400 transition-all text-slate-700 font-medium"
                        >
                            <option value="satisfaction">⭐ ระดับความพึงพอใจ</option>
                            <option value="resolved">✅ จำนวนเรื่องที่แก้ไขแล้ว</option>
                            <option value="reopened">⚠️ อัตรางานเปิดซ้ำ (Reopen)</option>
                            <option value="most_viewed">👁️ ยอดเข้าชมสูงสุด</option>
                            <option value="most_voted">👍 ยอดโหวตสูงสุด</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                   </div>
               )}

               {viewMode === 'specific' && (
                   <div className="lg:col-span-4">
                        <label className="block text-sm text-slate-600 font-medium mb-1.5">เลือกเขตของท่าน</label>
                        <div className="relative">
                            <select 
                            value={specificDistrict} 
                            onChange={(e) => setSpecificDistrict(e.target.value)}
                            className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-base shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 text-indigo-800 font-bold"
                            >
                            {DISTRICT_NAMES.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={20} />
                        </div>
                   </div>
               )}

               <div className="lg:col-span-4">
                   <MultiSelectDropdown 
                      label="ประเภทปัญหา" 
                      options={ISSUE_CATEGORIES} 
                      selected={selectedCategories} 
                      onChange={setSelectedCategories}
                      placeholder="ทุกประเภท"
                      enableSearch={true}
                   />
               </div>

               {viewMode === 'all' && (
                 <div className="lg:col-span-6">
                    <MultiSelectDropdown 
                        label="เลือกเขต/สำนัก (เปรียบเทียบ)" 
                        options={DISTRICT_NAMES} 
                        selected={selectedDistricts} 
                        onChange={setSelectedDistricts} 
                        placeholder="ทุกเขต"
                        enableSearch={true}
                    />
                 </div>
               )}

               <div className={viewMode === 'all' ? "lg:col-span-6" : "lg:col-span-4"}>
                   <MultiSelectDropdown 
                      label="ฝ่ายงานภายใน" 
                      options={STANDARD_DEPARTMENTS} 
                      selected={selectedDepartments} 
                      onChange={setSelectedDepartments} 
                      placeholder="ทุกฝ่าย"
                      enableSearch={true}
                   />
               </div>
            </div>
         </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
         
         {viewMode === 'all' && (
             <>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                    <h2 className={`text-2xl font-bold ${theme.color} flex items-center gap-2`}>
                        {statType === 'satisfaction' && "อันดับความพึงพอใจ"}
                        {statType === 'resolved' && "อันดับการแก้ไขปัญหา"}
                        {statType === 'reopened' && "อันดับงานเปิดซ้ำ (Reopened)"}
                        {statType === 'most_viewed' && "เรื่องยอดนิยม (Top Views)"}
                        {statType === 'most_voted' && "เรื่องโหวตสูงสุด (Top Votes)"}
                    </h2>
                    <span className="text-sm text-slate-400">
                        {filteredData.length} เขต
                    </span>
                </div>

                <div className="space-y-4">
                    {filteredData.length > 0 ? (
                        filteredData.map((district) => (
                            <DistrictCard 
                                key={district.id} 
                                district={district} 
                                statType={statType} 
                                theme={theme}
                                viewMode="all"
                                sortIssues={sortIssues}
                            />
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
             </>
         )}

         {viewMode === 'specific' && filteredData.length > 0 && (
             <SingleDistrictView district={filteredData[0]} sortIssues={sortIssues} />
         )}
         {viewMode === 'specific' && filteredData.length === 0 && <EmptyState />}

      </main>
    </div>
  );
}

const EmptyState = () => (
    <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-600">ไม่พบข้อมูล</h3>
        <p className="text-slate-400 mt-1">ลองปรับเปลี่ยนตัวกรองช่วงเวลาหรือประเภทปัญหา</p>
    </div>
);

const SingleDistrictView = ({ district, sortIssues }) => {
    // Aggregate Metrics
    const metrics = useMemo(() => {
        let totalIssues = 0;
        let completed = 0;
        let reopened = 0;
        let pending = 0;
        let totalRating = 0;
        let ratedCount = 0;

        district.departments.forEach(dept => {
            totalIssues += dept.issues.length;
            dept.issues.forEach(i => {
                if (i.status === 'completed') completed++;
                if (i.status === 'reopened') reopened++;
                if (i.status === 'pending' || i.status === 'in_progress') pending++;
                if (i.rating > 0) {
                    totalRating += i.rating;
                    ratedCount++;
                }
            });
        });

        const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : "0.0";
        const reopenRate = totalIssues > 0 ? ((reopened / totalIssues) * 100).toFixed(1) : "0.0";
        const completeRate = totalIssues > 0 ? ((completed / totalIssues) * 100).toFixed(0) : "0";

        return { totalIssues, completed, reopened, pending, avgRating, reopenRate, completeRate, ratedCount };
    }, [district]);

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <MapPin className="text-indigo-600" size={32} />
                    {district.name}
                </h2>
                <p className="text-slate-500 mt-1 ml-11">รายงานสรุปภาพรวมการดำเนินงานประจำเขต</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard 
                    title="ความพึงพอใจเฉลี่ย" 
                    value={metrics.avgRating} 
                    subtext={`จาก ${metrics.ratedCount} ผู้ประเมิน`}
                    icon={<Smile size={24} />} 
                    color="text-yellow-600 bg-yellow-50 border-yellow-200" 
                />
                <MetricCard 
                    title="ดำเนินการเสร็จสิ้น" 
                    value={metrics.completed} 
                    subtext={`คิดเป็น ${metrics.completeRate}% ของงาน`}
                    icon={<CheckCircle2 size={24} />} 
                    color="text-green-600 bg-green-50 border-green-200" 
                />
                <MetricCard 
                    title="งานเปิดซ้ำ (Reopen)" 
                    value={metrics.reopened} 
                    subtext={`อัตราตีกลับ ${metrics.reopenRate}%`}
                    icon={<RotateCcw size={24} />} 
                    color="text-orange-600 bg-orange-50 border-orange-200" 
                />
                <MetricCard 
                    title="คงค้าง/กำลังทำ" 
                    value={metrics.pending} 
                    subtext="เรื่องที่ต้องติดตาม"
                    icon={<Clock size={24} />} 
                    color="text-blue-600 bg-blue-50 border-blue-200" 
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Building2 /> รายละเอียดรายฝ่าย
                </h3>
                {district.departments.map(dept => (
                    <DepartmentFullRow key={dept.id} dept={dept} sortIssues={sortIssues} />
                ))}
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, subtext, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-500">{title}</span>
            <div className={`p-2 rounded-lg ${color} bg-opacity-50`}>{icon}</div>
        </div>
        <div>
            <div className="text-3xl font-bold text-slate-800">{value}</div>
            <div className="text-xs text-slate-400 mt-1">{subtext}</div>
        </div>
    </div>
);

const DepartmentFullRow = ({ dept, sortIssues }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const metrics = useMemo(() => {
        const total = dept.issues.length;
        const reopened = dept.issues.filter(i => i.status === 'reopened').length;
        const completed = dept.issues.filter(i => i.status === 'completed').length;
        const rated = dept.issues.filter(i => i.rating > 0);
        const avg = rated.length > 0 ? (rated.reduce((a,b)=>a+b.rating,0)/rated.length).toFixed(1) : "-";
        
        return { total, reopened, completed, avg };
    }, [dept]);

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 cursor-pointer hover:bg-slate-50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
                <div className="md:col-span-4 flex items-center gap-3">
                    <div className={`p-1.5 rounded-md ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">{dept.name}</h4>
                        <span className="text-xs text-slate-400">ทั้งหมด {metrics.total} เรื่อง</span>
                    </div>
                </div>

                <div className="md:col-span-8 flex justify-between items-center gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <div className="text-center flex-1">
                        <div className="text-xs text-slate-400 mb-1">ความพึงพอใจ</div>
                        <div className="font-bold text-slate-700 flex justify-center items-center gap-1">
                            <Star size={14} className="text-yellow-400 fill-yellow-400"/> {metrics.avg}
                        </div>
                    </div>
                    <div className="text-center flex-1 border-l border-slate-100">
                        <div className="text-xs text-slate-400 mb-1">งานแก้</div>
                        <div className={`font-bold ${metrics.reopened > 0 ? 'text-orange-600' : 'text-slate-300'}`}>
                            {metrics.reopened}
                        </div>
                    </div>
                    <div className="text-center flex-1 border-l border-slate-100">
                        <div className="text-xs text-slate-400 mb-1">เสร็จสิ้น</div>
                        <div className="font-bold text-green-600">{metrics.completed}</div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-100 p-6">
                    {/* Reuse Issue Grid but show ALL info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortIssues(dept.issues).map(issue => (
                            <IssueCard key={issue.id} issue={issue} statType="all" theme={{color:'text-slate-600'}} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const DistrictCard = ({ district, statType, theme, sortIssues }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Reuse existing logic from previous step, but simplified for brevity
  const stats = useMemo(() => {
    let targetValue = 0; let subValue = ""; let leftSubtitle = null;
    let totalIssues = 0;
    district.departments.forEach(d => totalIssues += d.issues.length);
    
    let val = 0; 
    let count = 0;
    let totalRated = 0;
    let totalCompleted = 0;
    let totalComments = 0;

    district.departments.forEach(d => {
        d.issues.forEach(i => {
            if(statType === 'satisfaction') {
                if(i.rating > 0) { val+=i.rating; count++; totalRated++; }
                if(i.status === 'completed') totalCompleted++;
                if(i.comment) totalComments++;
            }
            if(statType === 'reopened' && i.status === 'reopened') { val++; }
            if(statType === 'resolved' && i.status === 'completed') { val++; }
            if(statType === 'most_viewed') { val+=i.views; }
            if(statType === 'most_voted') { val+=i.votes; }
        });
    });

    if(statType === 'satisfaction') {
        targetValue = count > 0 ? (val/count).toFixed(1) : "0.0";
        subValue = <div className="flex text-yellow-400 gap-0.5 justify-center sm:justify-end">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill={i<Math.round(Number(targetValue))?"currentColor":"none"} className={i<Math.round(Number(targetValue))?"":"text-slate-200"}/>)}</div>;
        
        const percentRated = totalCompleted > 0 ? ((totalRated / totalCompleted) * 100).toFixed(0) : 0;
        leftSubtitle = (
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                   <Star size={10} /> {percentRated}% ประเมิน ({totalRated}/{totalCompleted})
                </span>
                {totalComments > 0 && (
                    <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full">
                       <MessageCircle size={10} /> {totalComments} คำชม
                    </span>
                )}
            </div>
        );
    }
    else if(statType === 'reopened') subValue = <div className="text-xs text-slate-400 mt-1">จากทั้งหมด {totalIssues} เรื่อง</div>;
    else subValue = <div className="text-xs text-slate-400 mt-1">รายการ</div>;

    if(statType !== 'satisfaction') {
        if(statType === 'reopened') targetValue = totalIssues > 0 ? ((val/totalIssues)*100).toFixed(1)+"%" : "0.0%";
        else targetValue = val.toLocaleString();
    }

    return { totalIssues, targetValue, subValue, leftSubtitle };
  }, [district, statType]);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isExpanded ? `shadow-lg border-${theme.color.split('-')[1]}-200` : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 pb-14 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4 relative group"
      >
        <div className="flex items-center gap-5">
           <div className={`p-3.5 rounded-xl ${isExpanded ? theme.bg + ' ' + theme.color : 'bg-slate-100 text-slate-500'}`}>
              <MapPin size={28} />
           </div>
           <div>
              <h3 className="text-2xl font-bold text-slate-800">{district.name}</h3>
              {statType === 'satisfaction' && stats.leftSubtitle}
           </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
            <div className={`text-3xl font-bold ${theme.color} flex items-center justify-center sm:justify-end gap-1`}>
                {stats.targetValue}
            </div>
            {stats.subValue}
        </div>
        
        {/* Desktop & Mobile Expansion Cue - Explicit Text (Always visible now) */}
        <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-center items-center bg-slate-50 border-t border-slate-100 rounded-b-2xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all gap-2">
            {isExpanded ? "ย่อข้อมูล" : "ดูรายละเอียด 10 ฝ่ายงาน"} 
            <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm group-hover:border-indigo-200">
                 <ChevronDown size={14} className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
        </div>
      </div>
      {isExpanded && (
         <div className="border-t border-slate-100 bg-slate-50/50 p-6 pt-8 pb-8">
            {district.departments.map(dept => (
               <DepartmentAccordion key={dept.id} dept={dept} statType={statType} theme={theme} sortIssues={sortIssues} />
            ))}
         </div>
      )}
    </div>
  );
};

const DepartmentAccordion = ({ dept, statType, theme, sortIssues }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Calculate stats
    const stats = useMemo(() => {
        let value = 0; let subValue = null; let leftSubtitle = null; let isDisabled = false;
        const total = dept.issues.length;
        const reopened = dept.issues.filter(i=>i.status==='reopened').length;
        const completed = dept.issues.filter(i=>i.status==='completed').length;
        
        if(statType === 'reopened') {
            if(reopened === 0) isDisabled = true;
            value = total > 0 ? ((reopened/total)*100).toFixed(1)+"%" : "0.0%";
            subValue = <span className="flex gap-2 text-sm text-slate-400"><span>เปิดเรื่องใหม่ {reopened}</span><span>เสร็จ {completed}</span></span>;
        } else if(statType === 'satisfaction') {
            const rated = dept.issues.filter(i=>i.rating>0);
            const commentsCount = dept.issues.filter(i=>i.comment).length;
            if(rated.length === 0) isDisabled = true;
            value = rated.length > 0 ? (rated.reduce((a,b)=>a+b.rating,0)/rated.length).toFixed(1) : "0.0";
            subValue = <div className="flex text-yellow-400 gap-0.5 justify-center sm:justify-end">{[...Array(5)].map((_,i)=><Star key={i} size={12} fill={i<Math.round(Number(value))?"currentColor":"none"} className={i<Math.round(Number(value))?"":"text-slate-200"}/>)}</div>;
            
            // Add left subtitle for Department Level satisfaction
            const percentRated = completed > 0 ? ((rated.length / completed) * 100).toFixed(0) : 0;
            leftSubtitle = (
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                       <Star size={10} /> {percentRated}% ประเมิน ({rated.length}/{completed})
                    </span>
                    {commentsCount > 0 && (
                        <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full">
                           <MessageCircle size={10} /> {commentsCount} คำชม
                        </span>
                    )}
                </div>
            );
        } else {
            // Default handlers for other types
            value = dept.issues.length;
        }
        return { value, subValue, leftSubtitle, isDisabled };
    }, [dept, statType]);

    // Issues to show
    const visibleIssues = useMemo(() => {
        let issues = sortIssues(dept.issues);
        if(statType==='reopened') {
            issues = issues.filter(i => i.status === 'reopened');
        }
        if(statType==='satisfaction') {
            issues = issues.filter(i => i.rating > 0);
        }
        return issues;
    }, [dept.issues, statType, sortIssues]);

    return (
        <div className={`mb-4 bg-white border border-slate-200 rounded-xl overflow-hidden ${stats.isDisabled ? 'opacity-50' : ''}`}>
            <div 
                onClick={() => !stats.isDisabled && setIsExpanded(!isExpanded)}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-4 ${stats.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'} transition-colors`}
            >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`p-2 rounded-lg ${isExpanded ? 'bg-slate-100' : 'bg-slate-50'}`}>
                        {isExpanded ? <ChevronDown size={20} className="text-slate-500"/> : <ChevronRight size={20} className="text-slate-400"/>}
                    </div>
                    <div>
                        <h4 className={`text-lg font-bold ${stats.isDisabled ? 'text-slate-400' : 'text-slate-700'}`}>{dept.name}</h4>
                        {stats.leftSubtitle}
                    </div>
                </div>
                <div className="text-center sm:text-right w-full sm:w-auto">
                    <div className={`text-xl font-bold ${stats.isDisabled ? 'text-slate-400' : theme.color}`}>{stats.value}</div>
                    {stats.subValue}
                </div>
            </div>
            {isExpanded && !stats.isDisabled && (
                <div className="border-t border-slate-100 bg-slate-50 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {visibleIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} statType={statType} theme={theme} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const IssueCard = ({ issue, statType, theme }) => {
    
    // Color scale helper for Satisfaction Stars
    const getStarColorClass = (rating) => {
        if (rating >= 5) return "text-yellow-500 bg-yellow-50 border-yellow-100"; // Gold
        if (rating >= 4) return "text-green-500 bg-green-50 border-green-100"; // Good
        if (rating >= 3) return "text-blue-500 bg-blue-50 border-blue-100"; // OK
        if (rating >= 2) return "text-orange-500 bg-orange-50 border-orange-100"; // Poor
        return "text-red-500 bg-red-50 border-red-100"; // Very Poor
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col group">
            <div className="relative h-36 bg-slate-200 overflow-hidden flex-shrink-0">
                <img src={issue.imageUrl} alt="issue" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    {issue.status === 'reopened' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-bold border border-orange-200 flex items-center gap-1"><RotateCcw size={12}/> แก้ไข</span>}
                    {issue.status === 'completed' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-200 flex items-center gap-1"><CheckCircle2 size={12}/> เสร็จ</span>}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <span className="text-xs text-white font-mono font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">{issue.ticketId}</span>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2" title={issue.topic}>{issue.topic}</h5>
                {statType === 'satisfaction' && issue.comment && <div className="mb-3 p-2.5 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-slate-600 italic">"{issue.comment}"</div>}
                
                <div className="mb-3 space-y-1">
                    <div className="flex justify-between text-xs text-slate-500"><span>แจ้ง:</span><span>{issue.reportDate}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>อัพเดท:</span><span>{issue.lastUpdate}</span></div>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{issue.category}</span>
                    <div className={`text-sm font-bold ${theme.color} flex items-center gap-1`}>
                        {statType === 'reopened' && issue.status === 'reopened' && <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full border border-orange-100">แก้ {issue.reopenCount} ครั้ง</span>}
                        {statType === 'satisfaction' && issue.rating > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getStarColorClass(issue.rating)}`}>
                                <Star size={12} fill="currentColor"/> {issue.rating}
                            </span>
                        )}
                        {/* Fallbacks */}
                        {statType !== 'reopened' && statType !== 'satisfaction' && issue.views > 0 && <><Eye size={14}/> {issue.views}</>}
                    </div>
                </div>
            </div>
        </div>
    );
};