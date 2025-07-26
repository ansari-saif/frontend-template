
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted ml-64 flex items-center justify-center">
      <div className="text-center p-8">
        {/* Main Title with enhanced styling */}
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-success bg-clip-text text-transparent mb-6 leading-tight">
            Hospital Management System
          </h1>
          
          {/* Subtle underline accent */}
          <div className="mx-auto w-32 h-1 bg-gradient-to-r from-primary to-success rounded-full mb-8"></div>
        </div>
        
        {/* Enhanced subtitle */}
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Solving healthcare problems using technology with a focus on clarity, trust, and efficiency
        </p>
      </div>
    </div>
  )
}

export default Dashboard 