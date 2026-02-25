import React from 'react';

export default function ViewExample_Header() {
  const medicineData = {
    original: {
      name: "Shelcal 500mg",
      brand: "Torrent Pharmaceuticals Ltd",
      status: "top 1% manufacturer",
      approval: "FDA Approved",
      contents: "Elemental Calcium(500 Mg) / Vitamin D3(cholecalciferol) (250 Iu)",
      currentPrice: "₹95.6",
      mrp: "MRP ₹119.5",
      discount: "20% OFF",
      img: "https://i.ibb.co/ZzV0f0N/shelcal.png" 
    },
    substitute: {
      name: "Cipcal 500mg",
      brand: "Cipla Ltd",
      status: "top 1% manufacturer",
      approval: "FDA Approved",
      contents: "Elemental Calcium(500 Mg) / Vitamin D3(cholecalciferol) (250 Iu)",
      currentPrice: "₹58.55",
      saving: "51% cheaper",
      img: "https://i.ibb.co/m0zXpYJ/cipcal.png"
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white font-sans antialiased text-[#4F585E]">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-2xl font-bold text-[#4F585E] mx-auto">Compare and understand</h1>
        <button className="absolute right-0 border border-gray-300 rounded-full p-1 hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Original Product */}
        <div className="bg-[#F6F6F6] border border-[#E0E0E0] rounded-[32px] p-6 flex flex-col">
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center mb-6 shadow-sm">
            <div className="w-24 h-24 flex items-center justify-center mb-2">
              <img src={medicineData.original.img} alt={medicineData.original.name} className="object-contain" />
            </div>
            <p className="font-bold text-[#4F585E]">{medicineData.original.name}</p>
          </div>

          <div className="space-y-4 flex-grow">
            <p className="text-sm">{medicineData.original.brand}</p>
            <div className="inline-block bg-[#FFF9E5] text-[#856404] text-[11px] font-bold px-2 py-1 rounded border border-[#FFEBA0] uppercase">
              {medicineData.original.status}
            </div>
            <p className="text-[#6F777F] font-medium uppercase text-xs">{medicineData.original.approval}</p>
            <p className="text-sm leading-relaxed text-[#4F585E]">
              Elemental Calcium(500 Mg) /<br />
              Vitamin D3(cholecalciferol)<br />
              (250 Iu)
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold text-[#1A1C1E]">{medicineData.original.currentPrice}</p>
            <p className="text-xs text-[#9BA3A9] line-through uppercase">{medicineData.original.mrp}</p>
            <p className="text-xs font-bold text-[#10847E]">{medicineData.original.discount}</p>
          </div>
        </div>

        {/* Card 2: Substitute Product */}
        <div className="bg-[#F8F5FF] border-2 border-[#7E3AF2] rounded-[32px] relative flex flex-col shadow-lg overflow-hidden">
          {/* Header Badge */}
          <div className="bg-[#7E3AF2] text-white h-10 flex items-center justify-center">
            <span className="text-sm font-bold">Substitute</span>
          </div>

          <div className="px-6 pb-6 flex flex-col flex-grow">
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center mt-4 mb-6 shadow-sm">
              <div className="w-24 h-24 flex items-center justify-center mb-2">
                <img src={medicineData.substitute.img} alt={medicineData.substitute.name} className="object-contain" />
              </div>
              <p className="font-bold text-[#4F585E]">{medicineData.substitute.name}</p>
            </div>

            <div className="space-y-4 flex-grow">
              <p className="text-sm">{medicineData.substitute.brand}</p>
              <div className="inline-block bg-[#FFF9E5] text-[#856404] text-[11px] font-bold px-2 py-1 rounded border border-[#FFEBA0] uppercase">
                {medicineData.substitute.status}
              </div>
              <p className="text-[#6F777F] font-medium uppercase text-xs">{medicineData.substitute.approval}</p>
              <p className="text-sm leading-relaxed text-[#4F585E]">
                Elemental Calcium(500 Mg) /<br />
                Vitamin D3(cholecalciferol)<br />
                (250 Iu)
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xl font-bold text-[#1A1C1E]">{medicineData.substitute.currentPrice}</p>
              <div className="mt-2 relative inline-block">
                {/* Custom Ribbon Shape */}
                <div className="bg-[#7E3AF2] text-white text-[11px] font-bold px-4 py-1.5 uppercase" 
                     style={{ clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)' }}>
                  {medicineData.substitute.saving}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}