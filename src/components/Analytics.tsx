import React, { useState, useEffect } from 'react';
import { InfrastructureProject } from '../types/Project';
import { completeProjectList } from '../data/projects';
import './Analytics.css';

interface AnalyticsData {
  totalProjects: number;
  totalFundsRaised: number;
  totalInvestors: number;
  projectsByStatus: Record<string, number>;
  projectsByCategory: Record<string, number>;
  topInvestors: Array<{
    wallet: string;
    totalInvested: number;
    projectCount: number;
  }>;
  recentInvestments: Array<{
    projectName: string;
    investorWallet: string;
    amount: number;
    date: string;
  }>;
  milestoneProgress: Array<{
    projectName: string;
    milestones: Array<{
      name: string;
      progress: number;
      status: string;
    }>;
  }>;
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<InfrastructureProject | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    setIsLoading(true);
    
    try {
      // Load investment data
      const investments = JSON.parse(localStorage.getItem('ethereus_investments') || '[]');
      const projectNFTs = JSON.parse(localStorage.getItem('ethereus_project_nfts') || '[]');
      
      // Calculate analytics
      const totalProjects = completeProjectList.length;
      const totalFundsRaised = completeProjectList.reduce((sum, project) => sum + project.raisedAmount, 0);
      const totalInvestors = completeProjectList.reduce((sum, project) => sum + project.investors, 0);
      
      // Projects by status
      const projectsByStatus = completeProjectList.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Projects by category
      const projectsByCategory = completeProjectList.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Top investors
      const investorMap = new Map<string, { totalInvested: number; projectCount: number }>();
      investments.forEach((investment: any) => {
        const wallet = investment.investorAddress;
        if (investorMap.has(wallet)) {
          const data = investorMap.get(wallet)!;
          data.totalInvested += investment.amount;
          data.projectCount += 1;
        } else {
          investorMap.set(wallet, {
            totalInvested: investment.amount,
            projectCount: 1
          });
        }
      });
      
      const topInvestors = Array.from(investorMap.entries())
        .map(([wallet, data]) => ({ wallet, ...data }))
        .sort((a, b) => b.totalInvested - a.totalInvested)
        .slice(0, 10);
      
      // Recent investments
      const recentInvestments = investments
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
        .map((investment: any) => ({
          projectName: investment.projectName,
          investorWallet: investment.investorAddress,
          amount: investment.amount,
          date: investment.date
        }));
      
      // Milestone progress
      const milestoneProgress = completeProjectList.slice(0, 10).map(project => ({
        projectName: project.name,
        milestones: project.milestones.map(milestone => ({
          name: milestone.name,
          progress: milestone.progress,
          status: milestone.status
        }))
      }));
      
      setAnalyticsData({
        totalProjects,
        totalFundsRaised,
        totalInvestors,
        projectsByStatus,
        projectsByCategory,
        topInvestors,
        recentInvestments,
        milestoneProgress
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} HBAR`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const shortenWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#38a169';
      case 'in-progress': return '#d69e2e';
      case 'pending': return '#718096';
      default: return '#718096';
    }
  };

  if (isLoading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-container">
        <div className="error">Failed to load analytics data</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <p>Comprehensive insights into African infrastructure projects</p>
      </div>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="stat-card">
            <div className="stat-icon">🏗️</div>
            <div className="stat-content">
              <h3>{analyticsData.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatPrice(analyticsData.totalFundsRaised)}</h3>
              <p>Total Funds Raised</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{analyticsData.totalInvestors.toLocaleString()}</h3>
              <p>Total Investors</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{Math.round((analyticsData.totalFundsRaised / (completeProjectList.reduce((sum, p) => sum + p.totalCost, 0))) * 100)}%</h3>
              <p>Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>Projects by Status</h3>
            <div className="status-chart">
              {Object.entries(analyticsData.projectsByStatus).map(([status, count]) => (
                <div key={status} className="status-item">
                  <div className="status-bar">
                    <div 
                      className="status-fill" 
                      style={{ 
                        width: `${(count / analyticsData.totalProjects) * 100}%`,
                        backgroundColor: getStatusColor(status)
                      }}
                    ></div>
                  </div>
                  <div className="status-label">
                    <span className="status-name">{status}</span>
                    <span className="status-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Projects by Category</h3>
            <div className="category-chart">
              {Object.entries(analyticsData.projectsByCategory).map(([category, count]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count}</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ width: `${(count / analyticsData.totalProjects) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Investors */}
        <div className="top-investors">
          <h3>🏆 Top Investors</h3>
          <div className="investors-list">
            {analyticsData.topInvestors.map((investor, index) => (
              <div key={investor.wallet} className="investor-item">
                <div className="investor-rank">#{index + 1}</div>
                <div className="investor-details">
                  <div className="investor-wallet">{shortenWallet(investor.wallet)}</div>
                  <div className="investor-stats">
                    <span>{formatPrice(investor.totalInvested)}</span>
                    <span>{investor.projectCount} projects</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Investments */}
        <div className="recent-investments">
          <h3>🔄 Recent Investments</h3>
          <div className="investments-list">
            {analyticsData.recentInvestments.map((investment, index) => (
              <div key={index} className="investment-item">
                <div className="investment-project">{investment.projectName}</div>
                <div className="investment-details">
                  <div className="investment-wallet">{shortenWallet(investment.investorWallet)}</div>
                  <div className="investment-amount">{formatPrice(investment.amount)}</div>
                  <div className="investment-date">{formatDate(investment.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="milestone-progress">
          <h3>🎯 Project Milestones</h3>
          <div className="milestones-list">
            {analyticsData.milestoneProgress.map((project, index) => (
              <div key={index} className="project-milestones">
                <h4>{project.projectName}</h4>
                <div className="milestones">
                  {project.milestones.map((milestone, mIndex) => (
                    <div key={mIndex} className="milestone-item">
                      <div className="milestone-header">
                        <span className="milestone-name">{milestone.name}</span>
                        <span 
                          className="milestone-status"
                          style={{ color: getStatusColor(milestone.status) }}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      <div className="milestone-progress-bar">
                        <div 
                          className="milestone-progress-fill" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                      <div className="milestone-percentage">{milestone.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
