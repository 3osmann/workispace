
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Check, 
  Search, 
  Filter, 
  X, 
  RefreshCw,
  SlidersHorizontal,
  PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/Layout';
import { BookingItem, BookingData } from '@/components/BookingItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const Bookings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Fake data for bookings
  const bookingsData: BookingData[] = [
    {
      id: 'book1',
      propertyName: 'Luxury Beach Front Villa',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      guestName: 'Michael Johnson',
      guestAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      checkIn: new Date('2023-09-10'),
      checkOut: new Date('2023-09-15'),
      totalAmount: 1750,
      status: 'confirmed',
      createdAt: new Date('2023-08-20')
    },
    {
      id: 'book2',
      propertyName: 'Modern Downtown Apartment',
      propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      guestName: 'Sarah Williams',
      guestAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      checkIn: new Date('2023-09-08'),
      checkOut: new Date('2023-09-12'),
      totalAmount: 720,
      status: 'pending',
      createdAt: new Date('2023-08-25')
    },
    {
      id: 'book3',
      propertyName: 'Cozy Mountain Cabin',
      propertyImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      guestName: 'David Thompson',
      guestAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      checkIn: new Date('2023-09-15'),
      checkOut: new Date('2023-09-20'),
      totalAmount: 1250,
      status: 'confirmed',
      createdAt: new Date('2023-08-15')
    },
    {
      id: 'book4',
      propertyName: 'Stylish Urban Loft',
      propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      guestName: 'Emily Davis',
      guestAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      checkIn: new Date('2023-09-05'),
      checkOut: new Date('2023-09-08'),
      totalAmount: 585,
      status: 'canceled',
      createdAt: new Date('2023-08-10')
    },
    {
      id: 'book5',
      propertyName: 'Waterfront Cottage',
      propertyImage: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      guestName: 'Robert Wilson',
      guestAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      checkIn: new Date('2023-09-20'),
      checkOut: new Date('2023-09-25'),
      totalAmount: 1400,
      status: 'pending',
      createdAt: new Date('2023-08-30')
    }
  ];

  // Filter bookings based on search query, status and date range
  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDateRange = !dateRange.from || !dateRange.to || (
      booking.checkIn >= dateRange.from && booking.checkOut <= dateRange.to
    );
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleApproveBooking = (id: string) => {
    toast({
      title: "Booking Approved",
      description: `Booking ID: ${id} has been approved successfully.`,
    });
  };

  const handleRejectBooking = (id: string) => {
    toast({
      title: "Booking Rejected",
      description: `Booking ID: ${id} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleBookingClick = (id: string) => {
    toast({
      title: "Booking Details",
      description: `Viewing details for booking ID: ${id}`,
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRange({ from: undefined, to: undefined });
    
    toast({
      title: "Filters Reset",
      description: "All booking filters have been reset.",
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage bookings and reservations</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range as any)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetFilters}
              className="hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredBookings.map((booking) => (
              <BookingItem 
                key={booking.id} 
                booking={booking}
                onApprove={handleApproveBooking}
                onReject={handleRejectBooking}
                onClick={handleBookingClick}
              />
            ))}

            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredBookings.length} of {bookingsData.length} bookings
              </p>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
