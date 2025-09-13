<?php
use App\Http\Controllers\{
    ProductController, CategoryController, SupplierController, ImportExportController,
    WholesaleController, SaleController, InventoryController, OrderController, OrderDetailController,
    UserCustomerController, UserTransportController, ReviewController, ImagePostController, RepostController,
    RetailController, AdminController, MonitorController, WarningController
};

Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::post('import-exports', ImportExportController::class.'@store');
Route::apiResource('wholesales', WholesaleController::class)->only(['index','store']);
Route::apiResource('sales', SaleController::class)->only(['index','store','destroy']);
Route::apiResource('inventory', InventoryController::class)->only(['index','update']);
Route::apiResource('orders', OrderController::class)->only(['index','show','store']);
Route::apiResource('order-details', OrderDetailController::class)->only(['index','show','destroy']);
Route::apiResource('user-customers', UserCustomerController::class);
Route::apiResource('user-transports', UserTransportController::class)->only(['index','store','destroy']);
Route::apiResource('reviews', ReviewController::class)->only(['index','store']);
Route::apiResource('image-posts', ImagePostController::class)->only(['index','store','destroy']);
Route::post('reposts', RepostController::class.'@store');
Route::apiResource('retails', RetailController::class)->only(['index','store']);
Route::apiResource('admins', AdminController::class)->only(['index','store','destroy']);
Route::apiResource('monitors', MonitorController::class)->only(['index','store']);
Route::apiResource('warnings', WarningController::class)->only(['index','store']);
