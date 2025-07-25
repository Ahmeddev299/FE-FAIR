import React, { useRef, useState } from 'react';
import {
    Shield,
    CheckCircle,
    User,
    Mail,
    ChevronLeft,
    FileText,
    ShieldCheck,
    Hourglass,
    Clock,
    ZoomOut,
    ZoomIn,
    Printer,
    RotateCcw,
    X,
    Edit3,
    Type
} from 'lucide-react';
import { DashboardLayout } from '@/components/layouts';
import Image from 'next/image';

// Type definitions
interface Party {
    name: string;
    role: string;
    email: string;
    status: 'pending' | 'completed' | 'declined';
    color: 'blue' | 'yellow' | 'green' | 'red';
    required: boolean;
}

// interface Tab {
//     label: string;
//     key: string;
// }

type SignatureTab = 'draw' | 'type';

const ElectronicSignatureInterface: React.FC = () => {
    const [zoom, setZoom] = useState<number>(100);
    const [showSignatureModal, setShowSignatureModal] = useState<boolean>(false);
    const [showDateModal, setShowDateModal] = useState<boolean>(false);
    const [signatureTab, setSignatureTab] = useState<SignatureTab>('draw');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const handleZoomIn = (): void => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = (): void => setZoom(prev => Math.max(prev - 25, 50));

    const handleSignatureClick = (): void => {
        setShowSignatureModal(true);
    };

    const handleDateClick = (): void => {
        setShowDateModal(true);
    };

    const handleCloseModal = (): void => {
        setShowSignatureModal(false);
        setShowDateModal(false);
        setSignatureTab('draw');
    };

    const startDrawing = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ): void => {
        if (!canvasRef.current) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();

        let x: number, y: number;
        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ): void => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();

        let x: number, y: number;
        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (): void => {
        setIsDrawing(false);
    };


    const clearCanvas = (): void => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const total: number = 3;
    const signed: number = 0;
    const pending: number = total - signed;
    const progress: number = (signed / total) * 100;

    const parties: Party[] = [
        {
            name: 'John Doe',
            role: 'Tenant',
            email: 'john.doe@company.com',
            status: 'pending',
            color: 'blue',
            required: true,
        },
        {
            name: 'Property Management LLC',
            role: 'Landlord',
            email: 'contracts@propertymanagement.com',
            status: 'pending',
            color: 'yellow',
            required: false,
        },
        {
            name: 'Sarah Wilson',
            role: 'Witness',
            email: 'sarah.wilson@legalfirm.com',
            status: 'pending',
            color: 'yellow',
            required: false,
        },
    ];
    return (
        <DashboardLayout>
            <div className="min-h-screen">
                {/* Header Style - Matching updated UI */}
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className="max-w-7xl mx-auto flex flex-col gap-y-4">
                        {/* Top Bar with Title and Description */}
                        <div className="max-w-7xl mx-auto flex flex-col gap-y-4">
                            <div className="flex items-center justify-between gap-x-4">
                                {/* Back Button */}
                                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Approval
                                </button>

                                {/* Divider (optional, vertical line) */}
                                <span className="hidden sm:inline-block h-5 border-l border-gray-300" />

                                {/* Title Section */}
                                <div className="flex items-center gap-x-1">
                                    <Image src='/loititle.png' width={40} height={40} alt="" className='mr-5' />

                                    <div>
                                        <h1 className="text-base sm:text-lg font-semibold text-gray-900">Electronic Signature</h1>
                                        <p className="text-sm text-gray-500">
                                            Sign your lease agreement electronically with legal validity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Document Card */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="text-blue-600 mt-0.5">
                                        <FileText className="w-5 h-5" />
                                    </div>

                                    {/* Text Content */}
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Document</p>

                                    </div>
                                </div>
                                <p className="text-sm text-blue-700 font-semibold">
                                    Downtown Office Lease Agreement
                                </p>
                                <p className="text-xs text-blue-600 mt-1">12 pages</p> {/* or "View" */}
                            </div>

                            {/* Security Card */}
                            <div className="bg-green-50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-green-600 mt-0.5">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-green-700">Security</p>
                                </div>
                                <p className="text-sm text-green-700 font-semibold mt-2">
                                    256-bit SSL encryption
                                </p>
                                <a href="#" className="text-xs text-green-600 hover:underline mt-1 inline-block">
                                    Learn how signatures work
                                </a>
                            </div>

                            {/* Status Card */}
                            <div className="bg-orange-50 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-orange-600 mt-0.5">
                                        <Hourglass className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-orange-700">Status</p>
                                </div>
                                <p className="text-sm text-orange-700 font-semibold mt-2">
                                    0 of 2 Signed
                                </p>
                                <p className="text-xs text-orange-600 mt-1">Awaiting signatures</p>
                            </div>
                        </div>

                        {/* Signature Progress */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1 text-sm text-gray-600">
                                <span>Signature Progress</span>
                                <span>0 of 2 parties signed</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>

                        {/* View Audit Trail Button */}
                        <div className="mt-3">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium text-gray-900 rounded-md px-3 py-1.5 hover:bg-gray-50 transition"
                            >
                                <Shield className="w-4 h-4 text-gray-700" />
                                View Audit Trail
                            </button>
                        </div>

                    </div>
                </div>


                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Panel - Document Viewer */}
                    <div className="lg:col-span-8 bg-white rounded-lg shadow-sm border border-gray-200">
                        {/* Document Header */}
                        <div className="w-full bg-white rounded-t-lg shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 text-sm">
                                {/* Left: Icon + Title */}
                                <div className="flex items-center space-x-2 font-medium text-gray-800">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span>Downtown Office Lease Agreement</span>
                                </div>

                                {/* Center: Pagination */}
                                {/* <div className="flex items-center space-x-3 text-gray-600">
                                    <button className="flex items-center space-x-1 hover:text-gray-800 hover:underline">
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Previous</span>
                                    </button>
                                    <span>Page <strong className="text-gray-800">1</strong> of <strong className="text-gray-800">12</strong></span>
                                    <button className="flex items-center space-x-1 hover:text-gray-800 hover:underline">
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div> */}

                                {/* Right: Zoom Controls */}
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <button onClick={handleZoomOut} className="hover:text-gray-800">
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm font-medium min-w-[40px] text-center">{zoom}%</span>
                                    <button onClick={handleZoomIn} className="hover:text-gray-800">
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <button className="hover:text-gray-800 ml-2">
                                        <Printer className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="p-4 sm:p-8 bg-white w-full max-w-4xl mx-auto" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                            {/* Document Title */}
                            <div className="text-center mb-6">
                                <h2 className="font-semibold text-lg sm:text-xl text-gray-800">COMMERCIAL LEASE AGREEMENT</h2>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2">Page 12 of 12</p>
                            </div>

                            {/* Witness Statement */}
                            <p className="text-center text-xs sm:text-sm text-gray-700 mb-8">
                                IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
                            </p>

                            {/* Signature Labels */}
                            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm mb-6 space-y-4 sm:space-y-0">
                                <div className="text-gray-800">
                                    <strong>TENANT:</strong>
                                    <div className="mt-2 text-gray-600">Signature</div>
                                    <div className="mt-1 text-gray-600">Date</div>
                                </div>
                                <div className="text-gray-800">
                                    <strong>LANDLORD:</strong>
                                    <div className="mt-2 text-gray-600">Signature</div>
                                    <div className="mt-1 text-gray-600">Date</div>
                                </div>
                            </div>

                            <div className="mb-6 text-xs sm:text-sm text-gray-800">
                                <strong>WITNESS:</strong>
                                <div className="mt-2 text-gray-600">Witness Signature</div>
                            </div>

                            {/* Signature Boxes Layout - Mobile Responsive */}
                            <div className="mt-8 flex flex-col items-center space-y-4 px-2 sm:px-0">
                                {/* Witness Signature */}
                                <div className="border-2 border-dashed border-gray-400 text-center px-4 py-4 rounded-lg w-full max-w-80 bg-gray-50">
                                    <div className="font-medium text-gray-700 mb-1 text-sm">Witness Signature</div>
                                    <div className="text-gray-800 text-sm">Sarah Wilson</div>
                                </div>

                                {/* Landlord and Date Row */}
                                <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                                    <div className="border-2 border-dashed border-gray-400 text-center px-4 py-4 rounded-lg flex-1 bg-gray-50">
                                        <div className="font-medium text-gray-700 mb-1 text-sm">Landlord Signature</div>
                                        <div className="text-gray-800 text-xs sm:text-sm">Property Management LLC</div>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-400 text-center px-4 py-4 rounded-lg w-full sm:w-32 bg-gray-50">
                                        <div className="font-medium text-gray-700 mb-1 text-sm">Date</div>
                                        <div className="text-gray-800 text-xs sm:text-sm">Property Management LLC</div>
                                    </div>
                                </div>

                                {/* Tenant Signature and Date Row */}
                                <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                                    <div className="border-2 border-dashed border-blue-500 bg-blue-50 text-center px-4 py-4 rounded-lg flex-1 shadow-sm">
                                        <div className="font-medium text-blue-700 mb-1 text-sm">Tenant Signature</div>
                                        <div className="text-gray-800 mb-2 text-xs sm:text-sm">John Doe</div>
                                        <button className="text-blue-600 underline text-xs sm:text-sm hover:text-blue-800 transition-colors" onClick={handleSignatureClick}>
                                            Click to sign
                                        </button>
                                    </div>
                                    <div className="border-2 border-dashed border-blue-500 bg-blue-50 text-center px-4 py-4 rounded-lg w-full sm:w-32 shadow-sm">
                                        <div className="font-medium text-blue-700 mb-1 text-sm">Date</div>
                                        <div className="text-gray-800 mb-2 text-xs sm:text-sm">John Doe</div>
                                        <button className="text-blue-600 underline text-xs sm:text-sm hover:text-blue-800 transition-colors" onClick={handleDateClick}>
                                            Click to sign
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Modal */}
                        {showSignatureModal && (
                            <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Add Your Signature</h3>
                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Signing as: John Doe (tenant)</p>
                                        </div>
                                        <button
                                            onClick={handleCloseModal}
                                            className="text-gray-500 hover:text-gray-700 p-1"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Tab Navigation */}
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            onClick={() => setSignatureTab('draw')}
                                            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 flex-1 ${signatureTab === 'draw'
                                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            <span>Draw</span>
                                        </button>
                                        <button
                                            onClick={() => setSignatureTab('type')}
                                            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium border-b-2 flex-1 ${signatureTab === 'type'
                                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                                }`}
                                        >
                                            <Type className="w-4 h-4" />
                                            <span>Type</span>
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    <div className="p-4 sm:p-6">
                                        {signatureTab === 'draw' ? (
                                            <div>
                                                {/* Drawing Canvas */}
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4 overflow-hidden">
                                                    <canvas
                                                        ref={canvasRef}
                                                        width={550}
                                                        height={200}
                                                        className="w-full h-32 sm:h-48 cursor-crosshair"
                                                        onMouseDown={startDrawing}
                                                        onMouseMove={draw}
                                                        onMouseUp={stopDrawing}
                                                        onMouseLeave={stopDrawing}
                                                        onTouchStart={startDrawing}
                                                        onTouchMove={draw}
                                                        onTouchEnd={stopDrawing}
                                                        style={{ touchAction: 'none' }}
                                                    />
                                                </div>

                                                <p className="text-center text-gray-600 text-xs sm:text-sm mb-4">
                                                    Draw your signature in the box above
                                                </p>

                                                {/* Clear Button */}
                                                <div className="flex justify-center mb-6">
                                                    <button
                                                        onClick={clearCanvas}
                                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-xs sm:text-sm"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                        <span>Clear</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Type your signature here"
                                                    className="w-full h-16 sm:h-20 text-lg sm:text-2xl text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 font-script px-2"
                                                    style={{ fontFamily: 'Brush Script MT, cursive' }}
                                                />
                                                <p className="text-center text-gray-600 text-xs sm:text-sm mt-4">
                                                    Type your signature in the box above
                                                </p>
                                            </div>
                                        )}

                                        {/* Legal Notice */}
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-6">
                                            <p className="text-xs sm:text-sm text-gray-700">
                                                <strong className="text-gray-800">Legal Notice:</strong> By signing this document electronically, you agree that your electronic signature is the legal equivalent of your manual signature and has the same legal effect as a handwritten signature.
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                                            <button
                                                onClick={handleCloseModal}
                                                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium order-2 sm:order-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCloseModal}
                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center space-x-2 order-1 sm:order-2"
                                            >
                                                <span>✓</span>
                                                <span>Add Signature</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {showDateModal && (
                        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-[460px] max-h-[90vh] overflow-y-auto">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Add Date</h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="px-4 sm:px-6 py-6 space-y-4">
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        Signing as: <span className="text-gray-900 font-medium">John Doe (tenant)</span>
                                    </p>

                                    {/* Date Box */}
                                    <div className="bg-blue-100 border border-blue-200 rounded-md px-4 py-3">
                                        <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">Today Date:</p>
                                        <p className="text-lg sm:text-xl font-semibold text-blue-900">
                                            {new Date().toLocaleDateString('en-GB')} {/* DD/MM/YYYY */}
                                        </p>
                                    </div>

                                    {/* Info Text */}
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        The current date will be automatically added to the document.
                                    </p>

                                    {/* Legal Notice */}
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 sm:p-4">
                                        <p className="text-xs sm:text-sm text-gray-700">
                                            <strong className="text-gray-900">Legal Notice:</strong> By signing this document electronically, you agree that your electronic signature is the legal equivalent of your manual signature and has the same legal effect as a handwritten signature.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-2">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm order-2 sm:order-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm flex items-center justify-center gap-2 order-1 sm:order-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Add Date
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Right Panel - Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Signature Progress Stats */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-gray-200">
                                <h3 className="font-medium text-gray-900">Signature Progress</h3>
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                {/* Progress Text and Count */}
                                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                                    <span>Completed</span>
                                    <span className="font-medium text-gray-900">{signed} of {total}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>

                                {/* Signed / Pending Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Signed */}
                                    <div className="bg-green-50 rounded-lg p-3 text-center">
                                        <div className="flex justify-center mb-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="text-lg font-bold text-green-600">{signed}</div>
                                        <div className="text-sm text-gray-600">Signed</div>
                                    </div>

                                    {/* Pending */}
                                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                        <div className="flex justify-center mb-1">
                                            <Clock className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <div className="text-lg font-bold text-yellow-600">{pending}</div>
                                        <div className="text-sm text-gray-600">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signing Parties */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-4 py-3 border-gray-200">
                                <h3 className="font-medium text-gray-900">Signing Parties</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {parties.map((person) => (
                                    <div
                                        key={person.email}
                                        className={`border rounded-lg  p-4 ${person.required
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-[#F9FAFB] border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <User className={`w-4 h-4 text-${person.color}-600`} />
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900 truncate max-w-[50px]">{person.name}</div>
                                                    <div className="text-xs text-gray-500">{person.role}</div>
                                                </div>
                                            </div>
                                            <span className={`text-xs bg-${person.color}-100 text-${person.color}-700 px-2 py-1 rounded-full`}>Pending</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 truncate max-w-full">{person.email}</p>
                                        {person.required ? (
                                            <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded w-max">Your signature is required</div>
                                        ) : (
                                            <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md py-1.5 text-sm text-gray-700 bg-white hover:bg-gray-50 transition">
                                                <Mail className="w-4 h-4" />
                                                Send Reminder
                                            </button>

                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-4 py-3  border-gray-200">
                                <h3 className="font-medium text-gray-900">Security & Compliance</h3>
                            </div>
                            <div className="p-4 space-y-2 text-sm">
                                {['256-bit SSL encryption', 'ESIGN Act compliant', 'Legally binding', 'Audit trail included'].map((text) => (
                                    <div key={text} className="flex items-center space-x-2">
                                        <Image src='/check.png' alt='check' width={15} height={`5`} />
                                        <span className="text-gray-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Document Info */}
                        <div className="bg-white rounded  shadow-sm border border-gray-200">
                            <div className="px-4 py-3  bg-[#BFDBFE]  border-gray-200">
                                <h3 className="font-medium text-gray-900">Document Information</h3>
                            </div>
                            <div className="p-4  bg-[#BFDBFE]  text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#1E40AF]">Document ID:</span>
                                    <span className="text-[#1E40AF] font-mono">DOC-001</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#1E40AF]">Created:</span>
                                    <span className="text-[#1E40AF]">Nov 15, 2024</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#1E40AF]">Last Modified:</span>
                                    <span className="text-[#1E40AF]">Nov 15, 2024</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#1E40AF]">Status:</span>
                                    <span className="text-[#1E40AF] text-orange-700 px-2 py-1 rounded-full text-xs">Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ElectronicSignatureInterface;
