<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    // ✅ Lấy dữ liệu settings
    public function getGeneral()
    {
        $setting = Setting::first();

        if (!$setting) {
            return response()->json([
                'company_name' => '',
                'logo' => null,
                'address' => ''
            ]);
        }

        return response()->json([
            'company_name' => $setting->company_name,
            'logo' => $setting->logo ? asset('storage/' . $setting->logo) : null,
            'address' => $setting->address,
        ]);
    }

    // ✅ Cập nhật dữ liệu settings
    public function updateGeneral(Request $request)
    {
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
        ]);

        $setting = Setting::first() ?? new Setting();

        if ($request->has('company_name')) {
            $setting->company_name = $request->company_name;
        }

        if ($request->has('address')) {
            $setting->address = $request->address;
        }

        if ($request->hasFile('logo')) {
            // 🔥 Xóa logo cũ nếu có
            if ($setting->logo && Storage::disk('public')->exists($setting->logo)) {
                Storage::disk('public')->delete($setting->logo);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $setting->logo = $path;
        }

        $setting->save();

        return response()->json([
            'message' => 'General settings saved!',
            'data' => [
                'company_name' => $setting->company_name,
                'logo' => $setting->logo ? asset('storage/' . $setting->logo) : null,
                'address' => $setting->address,
            ]
        ]);
    }
}
