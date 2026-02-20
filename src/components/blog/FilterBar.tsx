interface FilterBarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  const filters = ['all', 'tech', 'design', 'nature', 'culture', 'science']
  const filterLabels: Record<string, string> = {
    all: 'Tous',
    tech: 'Tech',
    design: 'Design',
    nature: 'Nature',
    culture: 'Culture',
    science: 'Science'
  }

  return (
    <div className="py-6 px-4 md:px-12 bg-[#e8f2ec] border-b border-[#c8ddd0] flex gap-2 flex-wrap items-center">
      <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-[#5a7a64] mr-2">
        Filtrer :
      </span>
      {filters.map((filter) => (
        <button
          key={filter}
          className={`font-sans text-[0.72rem] font-medium tracking-wider uppercase border px-4 py-1 cursor-pointer rounded-full transition-all ${
            activeFilter === filter
              ? 'bg-[#0d2818] border-[#0d2818] text-white'
              : 'bg-none border-[#c8ddd0] text-[#5a7a64] hover:bg-[#0d2818] hover:border-[#0d2818] hover:text-white'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filterLabels[filter]}
        </button>
      ))}
    </div>
  )
}