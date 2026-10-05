import { useState } from "react";
import { reportReview } from "../lib/api";

const REASONS = [
  ["spam", "Spam or ads"],
  ["abusive", "Abusive or hateful"],
  ["fake", "Fake or conflict of interest"],
  ["private", "Private information"],
  ["other", "Something else"],
];

export default function ReportButton({ reviewId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    if (!reason) return;
    setStatus("sending");
    try {
      await reportReview({ reviewId, reason, note: note.trim() });
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus(err.code === "23505" ? "duplicate" : "error");
    }
  }

  if (status === "done" || status === "duplicate") {
    return (
      <small className="muted">
        {status === "done" ? "Thanks, we'll take a look." : "You already reported this."}
      </small>
    );
  }

  if (!open) {
    return (
      <button type="button" className="report-link" onClick={() => setOpen(true)}>
        Report
      </button>
    );
  }

  return (
    <form className="report-form" onSubmit={submit}>
      <select value={reason} onChange={(e) => setReason(e.target.value)} required>
        <option value="">Why are you reporting this?</option>
        {REASONS.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      <input
        placeholder="Add details (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
      />
      <div className="form-actions">
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Submit report"}
        </button>
        <button type="button" className="report-link" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      {status === "error" && <p className="error">Couldn't send. Try again.</p>}
    </form>
  );
}