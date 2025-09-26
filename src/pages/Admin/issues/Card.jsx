const Card = ({ title, icon, gradient, textColor, value }) => (
  <div
    className={`rounded-lg shadow-md p-4 bg-gradient-to-r ${gradient} ${textColor} hover:shadow-lg transition transform hover:scale-105`}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">{title}</h3>
      <div className="bg-white/20 p-2 rounded-full">{icon}</div>
    </div>
    <p className="text-3xl font-extrabold mt-2">{value}</p>
  </div>
)
export default Card;