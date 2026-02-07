'use client';

const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Landscape', 'Renovation'];

interface ProjectFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ProjectFilter({ activeFilter, onFilterChange }: ProjectFilterProps) {
  return (
    <div className="sticky top-[64px] md:top-[80px] z-30 bg-light-bg/90 backdrop-blur-sm py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 justify-center">
        {categories.map((category) => {
          const filterValue = category.toLowerCase();
          const isActive = activeFilter === filterValue;

          return (
            <button
              key={category}
              onClick={() => onFilterChange(filterValue)}
              className={`font-sans text-sm tracking-wider uppercase transition-all duration-300 pb-1 border-b-2 ${
                isActive
                  ? 'text-coral border-coral'
                  : 'text-mid-gray hover:text-dark-gray border-transparent'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
