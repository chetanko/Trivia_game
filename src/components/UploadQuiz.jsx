import { useState } from 'react';
import { FaCircleCheck, FaFileArrowUp, FaSpinner } from 'react-icons/fa6';
import { useGame } from '../context/GameContext';
import { parseQuizFile, REQUIRED_COLUMNS } from '../utils/parseQuiz';

export default function UploadQuiz() {
  const { addQuiz } = useGame();
  const [file, setFile] = useState(null);
  const [quizName, setQuizName] = useState('');
  const [errors, setErrors] = useState([]);
  const [previewCount, setPreviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setErrors([]);
    setSuccessMessage('');
    setPreviewCount(0);

    if (selectedFile && !quizName) {
      setQuizName(selectedFile.name.replace(/\.(csv|xlsx)$/i, ''));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setErrors([]);
    setSuccessMessage('');

    const result = await parseQuizFile(file);
    setIsLoading(false);

    if (result.errors.length > 0) {
      setErrors(result.errors);
      setPreviewCount(0);
      return;
    }

    const quiz = addQuiz({
      name: quizName,
      questions: result.questions,
      source: file.name,
    });

    setPreviewCount(result.questions.length);
    setSuccessMessage(`${quiz.name} added to the library.`);
    setFile(null);
    setQuizName('');
    event.currentTarget.reset();
  }

  return (
    <section className="surface-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Upload Quiz</p>
          <h2 className="section-title">Import CSV or Excel</h2>
        </div>
        <a className="btn-ghost" href="/samples/classroom-sample-quiz.csv" download>
          Download Sample CSV
        </a>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="form-label">
          Quiz name
          <input
            className="input-field"
            value={quizName}
            onChange={(event) => setQuizName(event.target.value)}
            placeholder="Grade 6 Science Review"
          />
        </label>

        <label className="upload-dropzone">
          <FaFileArrowUp className="text-4xl text-skyroom" aria-hidden="true" />
          <span>{file ? file.name : 'Choose .csv or .xlsx file'}</span>
          <input className="sr-only" type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
        </label>

        <button type="submit" className="btn-primary justify-center" disabled={!file || isLoading}>
          {isLoading ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaFileArrowUp aria-hidden="true" />}
          {isLoading ? 'Validating' : 'Upload Quiz'}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <div className="grid min-w-[720px] grid-cols-8 bg-slate-100 text-sm font-black dark:bg-white/10">
          {REQUIRED_COLUMNS.map((column) => (
            <span key={column} className="border-r border-slate-200 p-3 last:border-r-0 dark:border-white/10">
              {column}
            </span>
          ))}
        </div>
      </div>

      {errors.length > 0 ? (
        <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100">
          <h3 className="font-black">Upload errors</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {errors.slice(0, 8).map((error, index) => (
              <li key={`${error.row}-${error.column}-${index}`}>
                Row {error.row}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-4 font-bold text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950/40 dark:text-emerald-100">
          <FaCircleCheck aria-hidden="true" />
          <span>
            {successMessage} {previewCount} questions imported.
          </span>
        </div>
      ) : null}
    </section>
  );
}
