function JobCard({ job, onEdit, onDelete }) {
    const statusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-700'
            case 'Interview': return 'bg-yellow-100 text-yellow-700'
            case 'Selected': return 'bg-green-100 text-green-700'
            case 'Rejected': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
                <h3 className="font-semibold text-gray-800">{job.company}</h3>
                <p className="text-sm text-gray-600">{job.role}</p>
                {job.notes && (
                    <p className="text-xs text-gray-500 mt-1">{job.notes}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                    Applied: {new Date(job.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                    })}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor(job.status)}`}>
                    {job.status}
                </span>
                <span
                    onClick={() => onEdit(job)}
                    className="material-symbols-outlined cursor-pointer p-2 rounded-full transition-all duration-200 hover:bg-blue-100 text-blue-600 hover:scale-110 active:scale-95"
                >
                    edit
                </span>
                <span
                    onClick={() => onDelete(job._id)}
                    className="material-symbols-outlined cursor-pointer p-2 rounded-full transition-all duration-200 hover:bg-red-100 text-red-600 hover:scale-110 active:scale-95"
                >
                    delete
                </span>
            </div>
        </div>
    )
}

export default JobCard