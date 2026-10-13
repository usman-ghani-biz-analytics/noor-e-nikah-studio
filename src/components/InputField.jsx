export default function InputField({ label, icon: Icon, value, onChange, type = "text", placeholder, theme }) {
  return (
    <div className="group">
      <label
        className="flex items-center gap-2 mb-1.5 uppercase"
        style={{
          color: theme.goldPrimary,
          opacity: 0.85,
          fontFamily: "'Playfair Display', serif",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
        }}
      >
        <Icon size={13} strokeWidth={2.2} />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="luxury-input w-full px-4 py-2.5 rounded-lg"
        style={{
          background: theme.inputBg,
          border: `1px solid ${theme.inputBorder}`,
          color: theme.textColor,
          fontSize: "1.05rem",
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.02em",
        }}
      />
    </div>
  );
}
