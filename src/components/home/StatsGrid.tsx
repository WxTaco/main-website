import { motion } from 'framer-motion'

const StatsGrid = () => {
  const stats = [
    { label: "Users", value: "10K+" },
    { label: "Messages Tracked/Day", value: "10K+" },
    { label: "Uptime", value: "99.4%" },
    { label: "Tools Available", value: "22+" }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
          className="text-center"
        >
          <div className="text-2xl md:text-3xl font-bold text-wrapped-400">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsGrid
