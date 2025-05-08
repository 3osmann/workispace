
/**
 * Dashboard.tsx
 * 
 * Description (FR):
 * Cette page sert de tableau de bord principal de l'application.
 * Elle présente:
 * - Un résumé des statistiques clés sous forme de cartes
 * - Des graphiques d'analyse des données
 * - Des raccourcis vers les fonctionnalités principales
 * - Une vue d'ensemble des activités récentes
 * - Une interface adaptée au rôle de l'utilisateur
 */

import React from 'react';
import { Layout } from '@/components/Layout';
import { StatCard } from '@/components/StatCard';
import { ChartDisplay } from '@/components/ChartDisplay';
import { PropertyCard, PropertyData } from '@/components/PropertyCard';
import { BookingItem, BookingData } from '@/components/BookingItem';
import { UserItem, UserData } from '@/components/UserItem';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  CreditCard, 
  ArrowUpRight, 
  TrendingUp,
  MessageSquare,
  Plus,
  Home,
  Settings,
  UserPlus,
  Calendar,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const statData = [
    {
      title: "Réservations totales",
      value: 1248,
      change: { value: 12.5, type: "increase" as const },
      icon: <Calendar className="h-4 w-4" />
    },
    {
      title: "Revenus mensuels",
      value: 42580,
      change: { value: 8.2, type: "increase" as const },
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      title: "Propriétés actives",
      value: 64,
      change: { value: 2, type: "increase" as const },
      icon: <Building2 className="h-4 w-4" />
    },
    {
      title: "Taux d'occupation",
      value: 86,
      change: { value: 1.3, type: "decrease" as const },
      icon: <User className="h-4 w-4" />
    }
  ];

  const revenueData = [
    { name: 'Jan', value: 25000 },
    { name: 'Feb', value: 22000 },
    { name: 'Mar', value: 30000 },
    { name: 'Apr', value: 28000 },
    { name: 'May', value: 35000 },
    { name: 'Jun', value: 42000 },
    { name: 'Jul', value: 45000 },
    { name: 'Aug', value: 48290 },
  ];

  const bookingsData = [
    { name: 'Jan', value: 180 },
    { name: 'Feb', value: 165 },
    { name: 'Mar', value: 210 },
    { name: 'Apr', value: 190 },
    { name: 'May', value: 240 },
    { name: 'Jun', value: 280 },
    { name: 'Jul', value: 320 },
    { name: 'Aug', value: 290 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de vos propriétés et réservations
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {statData.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ChartDisplay
            title="Revenus mensuels"
            description="Monthly revenue for the current year"
            data={revenueData}
          />
          <ChartDisplay
            title="Booking Analytics"
            description="Monthly booking counts"
            data={bookingsData}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
              <CardDescription>Monthly financial overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Earnings</span>
                  <span className="font-medium">$48,290</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Payments</span>
                  <span className="font-medium">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Refunds Processed</span>
                  <span className="font-medium">$3,290</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Net Revenue</span>
                  <span className="font-semibold text-green-600">$32,550</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
              <CardDescription>Current booking statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Confirmed</span>
                  <span className="font-medium text-green-600">38</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-amber-600">16</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Canceled</span>
                  <span className="font-medium text-red-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium text-blue-600">142</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New booking received</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Property status updated</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
