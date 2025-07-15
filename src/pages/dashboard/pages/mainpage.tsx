import React from 'react';
import {MapPin, Calendar, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';

function MainPage() {
    const listings = [
        {
            name: "Downtown Office Space",
            address: "123 Main St, Downtown",
            status: "Available",
            lastUpdate: "2 days ago",
            type: "Downtown Office Space"
        },
        {
            name: "Retail Space - Shopping Center",
            address: "456 Corporate Blvd, Midtown",
            status: "Pending",
            lastUpdate: "5 days ago",
            type: "Retail Space - Shopping Center"
        },
        {
            name: "Warehouse Facility",
            address: "789 Industrial Way, Eastside",
            status: "Available",
            lastUpdate: "1 week ago",
            type: "Warehouse Facility"
        }
    ];

    const leases = [
        {
            tenant: "Valley Tech",
            address: "890 Innovation Dr, Tech District",
            status: "Active",
            lastUpdate: "1 day ago"
        },
        {
            tenant: "Office Labs - Tech Hub",
            address: "600 Innovation Dr, Tech District",
            status: "Active",
            lastUpdate: "1 day ago"
        },
        {
            tenant: "Retail Space - Mall Location",
            address: "100 Shopping Center Blvd",
            status: "Pending",
            lastUpdate: "3 days ago"
        },
        {
            tenant: "Storage Facility",
            address: "200 Storage Lane, Industrial",
            status: "In Review",
            lastUpdate: "1 week ago"
        },
        {
            tenant: "Restaurant Space",
            address: "300 Food Court Ave",
            status: "Terminated",
            lastUpdate: "2 weeks ago"
        }
    ];

    const upcomingEvents = [
        {
            title: "Office Lease Renewal Due",
            date: "Jan 15, 2024",
            type: "High",
            location: "123 Main St"
        },
        {
            title: "Lease Termination Notice",
            date: "Jan 20, 2024",
            type: "Urgent",
            location: "Retail Space - Mall Location"
        },
        {
            title: "Document Review Required",
            date: "Jan 25, 2024",
            type: "Medium",
            location: "Various Properties"
        },
        {
            title: "Rent Payment Due",
            date: "Jan 30, 2024",
            type: "High",
            location: "Warehouse Facility"
        },
        {
            title: "Rent Payment Due",
            date: "Jan 30, 2024",
            type: "High",
            location: "Warehouse Facility"
        }
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'in review': return 'bg-purple-100 text-purple-800';
            case 'terminated': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header */}
                <header className="bg-white rounded-lg  shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-28">
                            <div className="items-center space-x-4">
                                <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                                <p className="text-lg text-gray-500">Here is what is happening with your leases and lots today</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Listings and Leases */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* My Lots Section */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900">My LOIs</h2>
                                </div>
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                           <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    LOI Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Property Address
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Last Updated
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold  ">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {listings.map((listing, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-black">{listing.name}</div>
                                                        
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm text-gray-500 flex items-center">
                                                                {listing.address}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                                                            {listing.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {listing.lastUpdate}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* My Leases Section */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-bold text-gray-900">My Leases</h2>
                                </div>
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Lease Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Property Address
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold   ">
                                                    Last Updated
                                                </th>
                                                <th className="px-6 py-3 text-left text-sm font-bold  ">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {leases.map((lease, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{lease.tenant}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            {lease.address}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lease.status)}`}>
                                                            {lease.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {lease.lastUpdate}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quick Actions and Upcoming Events */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        Add new Lease Documents
                                    </button>
                                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                        View Lease Documents
                                    </button>
                                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                                        Terminate Lease
                                    </button>
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                                <div className="space-y-4">
                                    {upcomingEvents.map((event, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(event.type)}`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {event.date}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {event.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}

export default MainPage;