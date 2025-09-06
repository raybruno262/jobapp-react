import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { DashboardAPI } from '../services/apiService';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Work as WorkIcon, Email as EmailIcon, People as PeopleIcon, Assignment as AssignmentIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon, AccessTime as PendingIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ icon, title, value, color }) => (
  <Paper sx={{ p: 2, height: '100%', borderRadius: 3 }} elevation={3}>
    <Box display="flex" alignItems="center" gap={2}>
      <Box sx={{ p: 2.3, borderRadius: '50%', backgroundColor: `${color}.light`, color: `${color}.dark`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h2" fontWeight="bold">{value}</Typography>
      </Box>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme(), isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true), [summary, setSummary] = useState(null), [jobTitles, setJobTitles] = useState([]);
  const [appStatus, setAppStatus] = useState([]), [messageActivity, setMessageActivity] = useState(null), [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryRes, jobTitlesRes, appStatusRes, messageActivityRes, recentActivitiesRes] = await Promise.all([
          DashboardAPI.getSummary(), DashboardAPI.getJobCategories(), DashboardAPI.getApplicationStatus(), 
          DashboardAPI.getMessageActivity(30), DashboardAPI.getRecentActivities()
        ]);
        setSummary(summaryRes); setJobTitles(jobTitlesRes);        setAppStatus(Object.entries(appStatusRes).map(([name, value]) => ({ name, value })));

        setMessageActivity(messageActivityRes); setRecentActivities(recentActivitiesRes.recentMessages || []);
      } catch (error) { console.error('Failed to fetch dashboard data:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress size={60} /></Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>Dashboard Overview</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={<WorkIcon fontSize="medium" />} title="Total Jobs" value={summary?.totalJobs || 0} color="primary" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={<AssignmentIcon fontSize="medium" />} title="Total Applications" value={summary?.totalApplications || 0} color="secondary" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={<PeopleIcon fontSize="medium" />} title="Active Users" value={summary?.activeUsers || 0} color="success" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard icon={<EmailIcon fontSize="medium" />} title="Total Messages" value={summary?.totalMessages || 0} color="warning" /></Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }} elevation={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color:"text.secondary"}}>Applications by Status</Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={appStatus} cx="50%" cy="50%" labelLine={false} outerRadius={70} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {appStatus.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
  <Paper sx={{ p: 2, borderRadius: 3, height: '100%', color: "text.secondary" }} elevation={3}>
    <Typography variant="subtitle1" gutterBottom fontWeight="bold">Job Distribution</Typography>
    <Box sx={{ height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={jobTitles.map(item => ({ name: item[0], count: item[1] }))} 
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Job Count" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
</Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }} elevation={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color:"text.secondary"}}>Message Activity (Last 30 Days)</Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={messageActivity?.dates?.map((date, index) => ({ date: format(new Date(date), 'MMM dd'), sent: messageActivity.sentCounts[index], received: messageActivity.receivedCounts[index] }))} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />
                  <Line type="monotone" dataKey="sent" stroke="#FF8042" activeDot={{ r: 6 }} name="Sent" />
                  <Line type="monotone" dataKey="received" stroke="#0088FE" name="Received" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }} elevation={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color:"text.secondary"}}>Application Status</Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={[{ name: 'Pending', value: summary?.pendingApplications || 0, icon: <PendingIcon />, color: '#FFBB28' }, { name: 'Accepted', value: summary?.acceptedApplications || 0, icon: <CheckCircleIcon />, color: '#00C49F' }, { name: 'Rejected', value: summary?.rejectedApplications || 0, icon: <CancelIcon />, color: '#FF8042' }]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {[{ name: 'Pending', color: '#FFBB28' }, { name: 'Accepted', color: '#00C49F' }, { name: 'Rejected', color: '#FF8042' }].map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie><Tooltip /><Legend /></PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: '#1c1c1c', color: '#ffffff' }} elevation={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#ffffff' }}>Recent Activities</Typography>
          <Box>
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
              <Box key={index} sx={{ p: 1.5, mb: 1, borderRadius: 2, backgroundColor: '#333', display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: '#f5f5f5' }} fontSize="small" />
                <Box>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>{activity.sender?.username || 'System'} → {activity.receiver?.username || 'You'}</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#bbbbbb' }}>{activity.messageText}</Typography>
                  <Typography variant="caption" sx={{ color: '#aaaaaa' }}>{format(new Date(activity.date), 'MMM dd, yyyy hh:mm a')}</Typography>
                </Box>
              </Box>
            )) : <Typography variant="body2" sx={{ py: 1.5, color: '#f5f5f5' }}>No recent activities</Typography>}
          </Box>
        </Paper>
      </Grid>
    </Box>
  );
};

export default Dashboard;