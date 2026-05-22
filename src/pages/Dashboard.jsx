import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJobs, addJob, deleteJob, updateJob } from '../utils/api'
import toast from 'react-hot-toast'
import StatsCard from '../components/StatsCard'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import ConfirmModal from '../components/ConfirmModal'

function Dashboard({ onLogout }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await getJobs()
      setJobs(res.data)
    } catch (err) {
      console.error('Jobs fetch error:', err)
      toast.error('Server is waking up, please wait...')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    onLogout(null)
    toast.success('Logged out successfully!')
    navigate('/login', { replace: true })
  }

  const handleOpenAdd = () => {
    setEditJob(null)
    setShowModal(true)
  }

  const handleEdit = (job) => {
    setEditJob(job)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditJob(null)
  }

  const handleSubmit = async (formData) => {
    try {
      if (editJob) {
        await updateJob(editJob._id, formData)
        toast.success('Job updated successfully!')
      } else {
        await addJob(formData)
        toast.success('Job added successfully!')
      }
      handleClose()
      fetchJobs()
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = (id) => setDeleteId(id)

  const confirmDelete = async () => {
    try {
      await deleteJob(deleteId)
      toast.success('Job deleted!')
      setDeleteId(null)
      fetchJobs()
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  const stats = [
    { label: 'Applied', color: 'text-blue-600' },
    { label: 'Interview', color: 'text-yellow-500' },
    { label: 'Selected', color: 'text-green-600' },
    { label: 'Rejected', color: 'text-red-500' },
  ]

  const filteredJobs = jobs
    .filter(j => filterStatus === 'All' ? true : j.status === filterStatus)
    .filter(j =>
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="overflow-y-scroll no-scrollbar h-64 min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">JobTracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <StatsCard
              key={s.label}
              label={s.label}
              count={jobs.filter(j => j.status === s.label).length}
              color={s.color}
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">My Applications</h2>
          <button
            onClick={handleOpenAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            + Add Job
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          {['All', 'Applied', 'Interview', 'Selected', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
        ${filterStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-indigo-50'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : filteredJobs.length === 0 && jobs.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">
            No jobs added yet. Click "+ Add Job" to start!
          </p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">
            No jobs found for "<span className="font-medium text-indigo-400">{filterStatus}</span>" status.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      <JobModal
        isOpen={showModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editJob={editJob}
      />
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Job?"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
      />

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout?"
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Logout"
      />

    </div>
  )
}

export default Dashboard