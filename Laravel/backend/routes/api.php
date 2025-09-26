<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserCustomersController;
use App\Http\Controllers\Api\UserTransportController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderDetailsController; // ✅ sửa đúng
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\RetailController;
use App\Http\Controllers\Api\WholesaleController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\MonitorController;
use App\Http\Controllers\Api\WarningController;
use App\Http\Controllers\Api\ImagePostController;
use App\Http\Controllers\Api\ImageExportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\SettingsController;

// ⚙️ Settings
Route::get('/settings/general', [SettingsController::class, 'getGeneral']);
Route::post('/settings/general', [SettingsController::class, 'updateGeneral']);

// 📊 Reports & Dashboard
Route::get('/reports', [ReportsController::class, 'index']);
Route::get('/dashboard', [DashboardController::class, 'stats']);

// 🛒 Orders
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// 👤 Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum'); // ✅ thêm logout

// 👥 Users
Route::apiResource('users', UserController::class);

// ✅ Reviews
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store'])->middleware('auth:sanctum'); // chỉ cho user đã login

// RESTful API resources
Route::apiResource('admin', AdminController::class);
Route::apiResource('user-customers', UserCustomersController::class); 
Route::apiResource('user-transports', UserTransportController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-details', OrderDetailsController::class); // ✅ sửa đúng
Route::apiResource('retail', RetailController::class); 
Route::apiResource('wholesales', WholesaleController::class); 
Route::apiResource('import-exports', ImportExportController::class); 
Route::apiResource('inventory', InventoryController::class); 
Route::apiResource('monitors', MonitorController::class);
Route::apiResource('warnings', WarningController::class);
Route::apiResource('image-posts', ImagePostController::class); 
Route::apiResource('image-exports', ImageExportController::class);
