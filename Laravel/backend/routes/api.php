<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserCustomersController;
use App\Http\Controllers\Api\UserTransportController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OderDetailsController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\RetailController;
use App\Http\Controllers\Api\WholesaleController;
use App\Http\Controllers\Api\ImportExportController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\MonitorController;
use App\Http\Controllers\Api\WarningController;
use App\Http\Controllers\Api\ImagePostController;
use App\Http\Controllers\Api\ImageExportController;
use App\Http\Controllers\Api\DashboardController;

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

// RESTful API resources
Route::apiResource('admin', AdminController::class);
Route::apiResource('user-customers', UserCustomersController::class); 
Route::apiResource('user-transports', UserTransportController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('oder-details', OderDetailsController::class); 
Route::apiResource('reviews', ReviewController::class); 
Route::apiResource('retail', RetailController::class); 
Route::apiResource('wholesales', WholesaleController::class); 
Route::apiResource('import-exports', ImportExportController::class); 
Route::apiResource('inventory', InventoryController::class); 
Route::apiResource('monitors', MonitorController::class);
Route::apiResource('warnings', WarningController::class);
Route::apiResource('image-posts', ImagePostController::class); 
Route::apiResource('image-exports', ImageExportController::class);
