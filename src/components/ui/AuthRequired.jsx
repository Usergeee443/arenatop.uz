export default function AuthRequired({ message, onLogin }) {
  return (
    <div className="auth-required">
      <p>{message}</p>
      <button type="button" className="btn btn--primary btn--sm" onClick={onLogin}>
        Kirish
      </button>
    </div>
  );
}
