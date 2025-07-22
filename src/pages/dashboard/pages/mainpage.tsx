import React from 'react';
import { Eye, Calendar } from 'lucide-react';
import Image from "next/image"; // ✅ Correct
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { DashboardLayout } from '@/components/layouts';

type Status = 'available' | 'pending' | 'active' | 'in review' | 'terminated';
type Priority = 'high' | 'urgent' | 'medium';

type Listing = {
    name: string;
    address: string;
    status: Status;
    lastUpdate: string;
    type: string;
};

type Lease = {
    tenant: string;
    address: string;
    status: Status;
    lastUpdate: string;
};

type Event = {
    title: string;
    date: string;
    type: Priority;
    location: string;
    icon: string | StaticImport;

};

function MainPage() {
    const listings: Listing[] = [
        {
            name: "Downtown Office Space",
            address: "123 Main St, Downtown",
            status: "available",
            lastUpdate: "2 days ago",
            type: "Downtown Office Space"
        },
        {
            name: "Retail Space - Shopping Center",
            address: "456 Corporate Blvd, Midtown",
            status: "pending",
            lastUpdate: "5 days ago",
            type: "Retail Space - Shopping Center"
        },
        {
            name: "Warehouse Facility",
            address: "789 Industrial Way, Eastside",
            status: "available",
            lastUpdate: "1 week ago",
            type: "Warehouse Facility"
        }
    ];

    const leases: Lease[] = [
        {
            tenant: "Valley Tech",
            address: "890 Innovation Dr, Tech District",
            status: "active",
            lastUpdate: "1 day ago"
        },
        {
            tenant: "Office Labs - Tech Hub",
            address: "600 Innovation Dr, Tech District",
            status: "active",
            lastUpdate: "1 day ago"
        },
        {
            tenant: "Retail Space - Mall Location",
            address: "100 Shopping Center Blvd",
            status: "pending",
            lastUpdate: "3 days ago"
        },
    ];

    const upcomingEvents: Event[] = [
        {
            title: "Office Lease Renewal Due",
            date: "Jan 15, 2024",
            type: "high",
            location: "123 Main St",
            icon: "/start.png"
        },
        {
            title: "Lease Termination Notice",
            date: "Jan 20, 2024",
            type: "urgent",
            location: "Retail Space - Mall Location",
            icon: "/termination.png"
        },
        {
            title: "Document Review Required",
            date: "Jan 25, 2024",
            type: "medium",
            location: "Various Properties",
            icon: "/preview.png",
        },
        {
            title: "Rent Payment Due",
            date: "Jan 30, 2024",
            type: "high",
            location: "Warehouse Facility",
            icon: "/rent02.png",
        },

    ];

    const getStatusColor = (status: Status) => {
        switch (status.toLowerCase()) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'in review': return 'bg-purple-100 text-purple-800';
            case 'terminated': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: Priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'urgent': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const truncateWords = (text: string, limit: number) => {
        const words = text.trim().split(" ");
        return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
    };



    return (
        <DashboardLayout>
            <div className=" flex-1 overflow-auto">
                {/* Header */}
                <header className="mx-auto bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 p-4">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, John!</h1>
                            <p className="text-sm sm:text-base text-gray-500 mt-1">Here is what is happening with your leases and LOIs today.</p>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-4 sm:p-6 lg:p-0 mt-4">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Left Column - Listings and Leases */}
                        <div className="xl:col-span-3 space-y-6">
                            {/* My LOIs Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">My LOIs</h2>
                                </div>

                                {/* Mobile Card View */}
                                <div className="block lg:hidden">
                                    <div className="divide-y divide-gray-100">
                                        {listings.map((listing, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">{listing.name}</h3>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)} flex-shrink-0`}>
                                                        {listing.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2 truncate">{listing.address}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">{listing.lastUpdate}</span>
                                                    <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                                        <Eye className="w-4 h-4" />
                                                        <span>View</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="p-6">
                                        <table className="min-w-full divide-y divide-gray-100 table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/4">LOI Title</th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/3">Property Address</th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">Status</th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">Last Updated</th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {listings.map((listing, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                                            {truncateWords(listing.name, 2)}
                                                        </td>
                                                        <td className="px-2 py-4 text-sm text-gray-500">
                                                            {truncateWords(listing.address, 2)}
                                                        </td>                                                        <td className="px-2 py-4">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                                                                {listing.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-4 text-sm text-gray-400">{listing.lastUpdate}</td>
                                                        <td className="px-4 py-4">
                                                            <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                                                <Eye className="w-4 h-4" />
                                                                <span>View</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                            {/* My Leases Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-5 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">My Leases</h2>
                                </div>

                                {/* Mobile Card View */}
                                <div className="block lg:hidden">
                                    <div className="divide-y divide-gray-100">
                                        {leases.map((lease, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2" title={lease.tenant}>
                                                        {truncateWords(lease.tenant, 2)}
                                                    </h3>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lease.status)} flex-shrink-0`}>
                                                        {lease.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2" title={lease.address}>
                                                    {truncateWords(lease.address, 2)}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">{lease.lastUpdate}</span>
                                                    <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                                        <Eye className="w-4 h-4" />
                                                        <span>View</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden lg:block">
                                    <div className="p-6">
                                        <table className="min-w-full divide-y divide-gray-100 table-fixed">
                                            <thead>
                                                <tr>
                                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/4">
                                                        Lease Title
                                                    </th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/3">
                                                        Property Address
                                                    </th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                                                        Status
                                                    </th>
                                                    <th className="px-2 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                                                        Last Updated
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-1/6">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {leases.map((lease, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-4 text-sm font-medium text-gray-900" title={lease.tenant}>
                                                            {truncateWords(lease.tenant, 2)}
                                                        </td>
                                                        <td className="px-2 py-4 text-sm text-gray-500" title={lease.address}>
                                                            {truncateWords(lease.address, 2)}
                                                        </td>
                                                        <td className="px-2 py-4">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lease.status)}`}>
                                                                {lease.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-4 text-sm text-gray-400">{lease.lastUpdate}</td>
                                                        <td className="px-4 py-4">
                                                            <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                                                <Eye className="w-4 h-4" />
                                                                <span>View</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Right Column - Quick Actions and Upcoming Events */}
                        <div className="xl:col-span-1 space-y-10">
                            {/* Quick Actions */}

                            <div className="bg-white rounded-xl shadow lg:p-4 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
                                <div className="space-y-5">

                                    {/* Start New LOI */}
                                    <button className="w-full flex items-center justify-start gap-3 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                                        <Image
                                            src="/star.png"
                                            alt="Start New LOI"
                                            width={30}
                                            height={24}
                                            className="w-6 h-4"
                                        />
                                        <span>Start New LOI</span>
                                    </button>

                                    {/* Upload Lease Document */}
                                    <button className="w-full flex items-center justify-start gap-3 bg-[#3B82F6] text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                                        <Image
                                            src="/start-loi-1.png"
                                            alt="Upload Document"
                                            width={24}
                                            height={24}
                                            className="w-7 h-4"
                                        />
                                        <span className="truncate inline-block max-w-[150px]">Upload Lease Document</span>
                                    </button>


                                    {/* Terminate Lease */}
                                    <button className="w-full flex items-center justify-start gap-3 bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 transition text-sm font-medium">
                                        <Image
                                            src="/start-loi-2.png"
                                            alt="Terminate Lease"
                                            width={24}
                                            height={24}
                                            className="w-7 h-4"
                                        />
                                        <span>Terminate Lease</span>
                                    </button>

                                </div>
                            </div>


                            {/* Upcoming Events */}
                            <div className="bg-white rounded-lg shadow lg:p-3 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                                <div className="space-y-4">
                                    {upcomingEvents.map((event, index) => (
                                        <div key={index} className="flex items-start gap-4 bg-gray-50 rounded-md p-3">

                                            {/* Icon */}
                                            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md">
                                                <Image
                                                    src={event.icon} // e.g., "/icons/calendar.png"
                                                    alt={event.title}
                                                    width={30}
                                                    height={30}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                        {event.title}
                                                    </h4>
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(event.type)}`}>
                                                        {event.type}
                                                    </span>
                                                </div>


                                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                                        {event.date}
                                                    </div>

                                                </div>

                                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default MainPage;