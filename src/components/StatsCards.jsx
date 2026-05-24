const StatsCards = ({ items }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {items.map((item) => (
            <div key={item.label} className="stat bg-base-100 rounded-box shadow-sm border border-base-300 px-4 py-3">
                <div className="stat-title text-xs uppercase tracking-wide opacity-70">{item.label}</div>
                <div className={`stat-value text-2xl ${item.color || 'text-primary'}`}>{item.value}</div>
                {item.desc && <div className="stat-desc text-xs">{item.desc}</div>}
            </div>
        ))}
    </div>
);

export default StatsCards;
