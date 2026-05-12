function StatsCard({ label, count, color }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <p className={`text-2xl font-bold ${color}`}>{count}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default StatsCard