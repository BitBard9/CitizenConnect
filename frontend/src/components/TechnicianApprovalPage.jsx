import { useState, useEffect } from "react";
import api from "../api/apiClients";
import ConfirmDialog from "./ConfirmDialog";

export default function TechnicianApprovalPage() {
  const [pendingTechnicians, setPendingTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, technician: null, action: null });

  useEffect(() => {
    fetchPendingTechnicians();
  }, []);

  const fetchPendingTechnicians = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/pending-technicians");
      setPendingTechnicians(data);
    } catch (error) {
      console.error("Error fetching pending technicians:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid) => {
    try {
      await api.put(`/users/${uid}/approve`);
      setPendingTechnicians(prev => prev.filter(t => t.uid !== uid));
      setConfirmDialog({ isOpen: false, technician: null, action: null });
    } catch (error) {
      console.error("Error approving technician:", error);
      alert("Failed to approve technician");
    }
  };

  const handleReject = async (uid) => {
    try {
      await api.delete(`/users/${uid}/reject`);
      setPendingTechnicians(prev => prev.filter(t => t.uid !== uid));
      setConfirmDialog({ isOpen: false, technician: null, action: null });
    } catch (error) {
      console.error("Error rejecting technician:", error);
      alert("Failed to reject technician");
    }
  };

  const openConfirmDialog = (technician, action) => {
    setConfirmDialog({ isOpen: true, technician, action });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading pending technicians...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pending Technician Approvals</h2>
        <p className="text-gray-600">Review and approve new technician registrations.</p>
      </div>

      {pendingTechnicians.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-500">No pending technician approvals at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specializations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingTechnicians.map((tech) => (
                  <tr key={tech.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {tech.firstName?.[0]}{tech.lastName?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tech.firstName} {tech.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tech.email}</div>
                      <div className="text-sm text-gray-500">{tech.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tech.specialization.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tech.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openConfirmDialog(tech, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openConfirmDialog(tech, "reject")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.action === "approve" ? "Approve Technician?" : "Reject Technician?"}
        message={
          confirmDialog.action === "approve"
            ? `Are you sure you want to approve ${confirmDialog.technician?.firstName} ${confirmDialog.technician?.lastName} as a technician?`
            : `Are you sure you want to reject ${confirmDialog.technician?.firstName} ${confirmDialog.technician?.lastName}'s registration? This action cannot be undone.`
        }
        confirmText={confirmDialog.action === "approve" ? "Approve" : "Reject"}
        cancelText="Cancel"
        type={confirmDialog.action === "approve" ? "info" : "danger"}
        onConfirm={() =>
          confirmDialog.action === "approve"
            ? handleApprove(confirmDialog.technician?.uid)
            : handleReject(confirmDialog.technician?.uid)
        }
        onCancel={() => setConfirmDialog({ isOpen: false, technician: null, action: null })}
      />
    </div>
  );
}
