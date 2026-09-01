import React, { useState } from 'react';
import {
  Download,
  Search,
  Sprout
} from 'lucide-react';
import { PUBLICATIONS } from '../../constants/mockData';

export const Resources: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPubs = PUBLICATIONS.filter((p) => {
    const matchesFilter = filterType === 'all' || p.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white text-slate-800">
      
      {/* Banner */}
      <div className="bg-[#0f3813] text-white py-14 px-4 md:px-8 border-b-4 border-[#2e7d32]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Sprout className="h-3.5 w-3.5" /> Document Center
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Publications, Reports & 80G Audits
          </h1>
          <p className="text-emerald-100 max-w-2xl text-xs md:text-sm leading-relaxed">
            Transparent public disclosures, annual audited statements, research case studies, and statutory compliance certifications.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-8">
        
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#f8fafc] p-4 rounded-xl border border-slate-200">
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'Annual Report', 'Case Study', 'Audit & 80G', 'Newsletter', 'Manual'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-[#2e7d32] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500'
                }`}
              >
                {type === 'all' ? 'All Documents' : type}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports or audits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#2e7d32]"
            />
          </div>

        </div>

        {/* Publication Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPubs.map((pub) => (
            <div
              key={pub.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-50 text-[#2e7d32] border border-emerald-200">
                    {pub.type}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{pub.year}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {pub.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{pub.fileSize} PDF</span>
                <a
                  href={pub.downloadUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading ${pub.title}`);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
