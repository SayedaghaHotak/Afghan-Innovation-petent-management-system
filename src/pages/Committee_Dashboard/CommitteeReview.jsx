import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import {
  FaDownload,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import "./CommitteeReview.css";

const CommitteeReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [patent, setPatent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isCommitteeAdmin, setIsCommitteeAdmin] = useState(false);

  // Evaluation Fields State
  const [scoreInnovation, setScoreInnovation] = useState("");
  const [scoreFeasibility, setScoreFeasibility] = useState("");
  const [scoreTechnical, setScoreTechnical] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const fetchPatentDetails = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        const currentUserId = sessionStorage.getItem("userId");

        const response = await axios.get(
          `http://localhost:8081/api/v1.0/patents/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const patentData = response.data;
        setPatent(patentData);

        // 🛡️ بررسی هوشمند رول کاربر لاگین شده
        if (patentData?.committee?.committeeAdmin?.id && currentUserId) {
          if (
            Number(patentData.committee.committeeAdmin.id) ===
            Number(currentUserId)
          ) {
            setIsCommitteeAdmin(true);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching patent:", err);

        // 🛑 دیتای موک برای دمو (در صورت قطعی سرور یا تست لوکال)
        setPatent({
          id: id,
          title: "Smart Irrigation System",
          innovetor: "Ahmad Wali",
          category: "Agricultural Technology",
          submissionDate: "2026-06-01",
          abstract:
            "This project presents an end-to-end automated system for monitoring and controlling greenhouse environments using specialized soil moisture and temperature sensors. It aims to optimize crop yields with minimal human intervention.",
          fileName: "proposal_document.pdf",
          committee: {
            committeeAdmin: { id: "1" },
          },
        });

        const mockUserId = sessionStorage.getItem("userId") || "1";
        if (mockUserId === "1") {
          setIsCommitteeAdmin(true);
        }

        setLoading(false);
      }
    };
    fetchPatentDetails();
  }, [id]);

  // 📥 دانلود فایل از سرور
  const handleDownloadFile = async (e) => {
    e.preventDefault();
    try {
      setDownloading(true);
      const token = sessionStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8081/api/v1.0/patents/${id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", patent?.fileName || `proposal_${id}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setDownloading(false);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not download the file from backend server.");
      setDownloading(false);
    }
  };

  // 🚀 ثبت نهایی ارزیابی و اتصال واقعی به EvaluationController بک‌اِند
  const handleFinalVerdict = async (verdictStatus) => {
    if (!scoreInnovation || !scoreFeasibility || !scoreTechnical || !comments) {
      alert("Please fill out all scores and comments before making a decision.");
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");

      // 🔥 ساخت دیتای خروجی هماهنگ با دی‌تی‌او EvaluationSubmitDTO بک‌اِند شما
      const payload = {
        patentId: Number(id),
        status: verdictStatus, // 'APPROVED', 'REJECTED' یا 'SCORED'
        innovationScore: Number(scoreInnovation),
        feasibilityScore: Number(scoreFeasibility),
        technicalScore: Number(scoreTechnical),
        feedback: comments,
      };

      console.log("Submitting Evaluation to Backend...", payload);

      // 🔗 ریکوئست مستقیم به کنترلر جدید ارزیابی
      const response = await axios.post(
        "http://localhost:8081/api/v1.0/evaluations/submit",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // گرفتن مسیج موفقیت از مپِ برگشتی بک‌اِند
      alert(response.data?.message || `Evaluation processed successfully as ${verdictStatus}!`);
      setSubmitting(false);
      navigate("/committee_dashboard/assigned");
    } catch (err) {
      console.error("Evaluation submission failed:", err);
      
      // نمایش پیام خطای واقعی برگشتی از سمت جاوا (اگر وجود داشته باشد)
      const serverErrorMessage = err.response?.data || "Server connection failed.";
      alert(`Failed to submit evaluation: ${serverErrorMessage}`);
      
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="loading-spinner">
        Loading Innovation Specifications...
      </div>
    );

  return (
    <div className="committee-review-viewport">
      {/* Header Section */}
      <div
        className="review-page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Expert Review & Verdict Panel</h2>
          <p>
            Examine the technical proposal, provide evaluation scoring, and
            issue decisions based on your role.
          </p>
        </div>
        <Button
          className="back-btn"
          onClick={() => navigate("/committee_dashboard/assigned")}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FaArrowLeft fontSize={11} /> Back to List
        </Button>
      </div>

      {/* Split Layout */}
      <div className="review-split-layout">
        {/* Left Column: Patent Specifications */}
        {/* Left Column: Patent Specifications */}
        <div className="patent-info-card">
          <h3>Innovation Specifications</h3>

          <div className="info-group">
            <label>Innovation Title</label>
            <p>
              <strong>{patent?.title || "Untitled Innovation"}</strong>
            </p>
          </div>

          {/* 🔥 فیکس اصلی ارور اینجاست: استخراج نام از داخل آبجکت کاربر */}
          <div className="info-group">
            <label>Innovator</label>
            <p>
              {patent?.innovator?.fullName || 
              `${patent?.innovator?.firstName || ""} ${patent?.innovator?.lastName || ""}`.trim() || 
              patent?.innovator?.email || 
              patent?.innovetor || 
              "System User"}
            </p>
          </div>

          <div className="info-group">
            <label>Category</label>
            <p>{patent?.category || "General Tech"}</p>
          </div>

          <div className="info-group">
            <label>Submission Date</label>
            <p>{patent?.submissionDate || (patent?.createdAt ? patent.createdAt.split("T")[0] : "Recent")}</p>
          </div>

          <div className="info-group">
            <label>Abstract / Summary</label>
            <p className="abstract-text">{patent?.abstract || "No abstract available."}</p>
          </div>

          <div className="info-group">
            <label>Proposal Document</label>
            <a
              href="#download"
              className="download-proposal-link"
              onClick={handleDownloadFile}
              style={{
                pointerEvents: downloading ? "none" : "auto",
                opacity: downloading ? 0.6 : 1,
              }}
            >
              <FaDownload />{" "}
              {downloading
                ? "Downloading Document..."
                : "Download Proposal PDF"}
            </a>
          </div>
        </div>

        {/* Right Column: Evaluation Form */}
        <div className="evaluation-form-card">
          <h3>Evaluation Form & Official Verdict</h3>

          <div className="scoring-grid">
            <div className="score-field">
              <label>Innovation Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 8"
                value={scoreInnovation}
                onChange={(e) => setScoreInnovation(e.target.value)}
              />
            </div>

            <div className="score-field">
              <label>Feasibility Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 7"
                value={scoreFeasibility}
                onChange={(e) => setScoreFeasibility(e.target.value)}
              />
            </div>

            <div className="score-field">
              <label>Technical Quality (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 9"
                value={scoreTechnical}
                onChange={(e) => setScoreTechnical(e.target.value)}
              />
            </div>
          </div>

          <div className="feedback-textarea-field">
            <label>Professional Evaluation Comments</label>
            <textarea
              placeholder="Write your official constructive critique and remarks regarding this project proposal here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#64748b",
              margin: "4px 0 0 0",
              textAlign: "center",
            }}
          >
            {isCommitteeAdmin
              ? "* شما به عنوان ادمین کمیته وارد شده‌اید. ثبت رای نهایی وضعیت ایده را تغییر می‌دهد."
              : "* شما به عنوان داور وارد شده‌اید. ثبت اطلاعات فقط امتیاز شما را ذخیره می‌کند."}
          </p>

          {/* مدیریت رول‌ها در رندر دکمه‌ها */}
          <div className="verdict-buttons-container">
            {isCommitteeAdmin ? (
              <>
                <button
                  className="btn-action btn-approve"
                  onClick={() => handleFinalVerdict("APPROVED")}
                  disabled={submitting}
                >
                  <FaCheck /> Approve Idea
                </button>

                <button
                  className="btn-action btn-reject"
                  onClick={() => handleFinalVerdict("REJECTED")}
                  disabled={submitting}
                >
                  <FaTimes /> Reject Idea
                </button>
              </>
            ) : (
              <button
                className="btn-action btn-scored"
                onClick={() => handleFinalVerdict("SCORED")}
                disabled={submitting}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  width: "100%",
                }}
              >
                <FaSave /> Submit Scores & Feedback
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeReview;
