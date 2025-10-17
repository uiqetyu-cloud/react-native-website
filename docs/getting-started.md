// Pixel - مشروع رفع جودة الصور إلى 4K // يحتوي على: 1) واجهة Flutter (main.dart) 2) سيرفر Python (Flask) يستخدم Real-ESRGAN أو FFmpeg placeholder // تعليمات سريعة: // 1) شغّل السيرفر Python: python3 server.py // 2) شغّل تطبيق Flutter: flutter run // 3) عدّل رابط API في main.dart إذا لزم

--- File: flutter/lib/main.dart --- import 'dart:io'; import 'package:flutter/material.dart'; import 'package:image_picker/image_picker.dart'; import 'package:http/http.dart' as http; import 'package:path_provider/path_provider.dart'; import 'package:share_plus/share_plus.dart';

void main() => runApp(const PixelApp());

class PixelApp extends StatelessWidget { const PixelApp({super.key}); @override Widget build(BuildContext context) { return MaterialApp( debugShowCheckedModeBanner: false, title: 'Pixel', theme: ThemeData( scaffoldBackgroundColor: Colors.black, colorScheme: ColorScheme.fromSwatch().copyWith(secondary: Colors.purple), brightness: Brightness.dark, ), home: const HomePage(), ); } }

class HomePage extends StatefulWidget { const HomePage({super.key}); @override State<HomePage> createState() => _HomePageState(); }

class _HomePageState extends State<HomePage> { File? _original; File? _result; bool _loading = false; final ImagePicker _picker = ImagePicker();

// عدّل هذا إلى رابط السيرفر عندك final String apiUrl = 'http://10.0.2.2:5000/enhance'; // Android emulator uses 10.0.2.2

Future<void> _pickImage(ImageSource src) async { final XFile? img = await _picker.pickImage(source: src, imageQuality: 90); if (img == null) return; setState(() { _original = File(img.path); _result = null; }); }

Future<void> _uploadAndEnhance() async { if (_original == null) return; setState(() => _loading = true); final request = http.MultipartRequest('POST', Uri.parse(apiUrl)); request.files.add(await http.MultipartFile.fromPath('image', original!.path)); try { final streamed = await request.send(); final res = await http.Response.fromStream(streamed); if (res.statusCode == 200) { final bytes = res.bodyBytes; final dir = await getTemporaryDirectory(); final outFile = File('${dir.path}/pixel_result${DateTime.now().millisecondsSinceEpoch}.png'); await outFile.writeAsBytes(bytes); setState(() { _result = outFile; }); } else { _showMsg('خطأ من السيرفر: ${res.statusCode}'); } } catch (e) { _showMsg('فشل الاتصال: $e'); } finally { setState(() => _loading = false); } }

void _showMsg(String msg) { if (!mounted) return; ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg))); }

Future<void> _saveOrShare(File file) async { final dir = await getTemporaryDirectory(); final out = await file.copy('${dir.path}/${file.uri.pathSegments.last}'); await Share.shareXFiles([XFile(out.path)], text: 'صورة محسنة بواسطة Pixel'); }

@override Widget build(BuildContext context) { return Scaffold( appBar: AppBar( title: const Text('Pixel'), backgroundColor: Colors.black, elevation: 0, ), body: Padding( padding: const EdgeInsets.all(16.0), child: Column( children: [ Expanded( child: Row( children: [ Expanded(child: _imageCard(_original, 'الأصلية')), const SizedBox(width: 12), Expanded(child: _imageCard(_result, 'المعدلة')), ], ), ), const SizedBox(height: 12), Row( mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [ ElevatedButton.icon( onPressed: () => _pickImage(ImageSource.gallery), icon: const Icon(Icons.photo_library), label: const Text('اختيار'), ), ElevatedButton.icon( onPressed: () => _pickImage(ImageSource.camera), icon: const Icon(Icons.camera_alt), label: const Text('كاميرا'), ), ElevatedButton.icon( onPressed: _loading ? null : _uploadAndEnhance, icon: _loading ? const SizedBox(width:16,height:16,child:CircularProgressIndicator(strokeWidth:2)) : const Icon(Icons.upgrade), label: const Text('تحسين الجودة'), ), ElevatedButton.icon( onPressed: _result == null ? null : () => _saveOrShare(_result!), icon: const Icon(Icons.share), label: const Text('مشاركة/حفظ'), ), ], ), const SizedBox(height: 8), const Text('Pixel • تحسين الصور إلى 4K', style: TextStyle(color: Colors.white70)), ], ), ), ); }

Widget _imageCard(File? file, String label) { return Container( decoration: BoxDecoration( color: Colors.grey[900], borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white12), ), padding: const EdgeInsets.all(8), child: Column( children: [ Expanded( child: Center( child: file == null ? Text(label, style: const TextStyle(color: Colors.white54)) : Image.file(file, fit: BoxFit.contain), ), ), const SizedBox(height: 8), Text(label, style: const TextStyle(color: Colors.white70)), ], ), ); } }

--- File: server/server.py ---

Python Flask server example

متطلبات: pip install flask pillow realesrgan (أو استخدم subprocess لتشغيل نموذج خارجي)

from flask import Flask, request, send_file, jsonify from PIL import Image import io import os import subprocess

app = Flask(name)

UPLOAD_DIR = 'uploads' RESULT_DIR = 'results' os.makedirs(UPLOAD_DIR, exist_ok=True) os.makedirs(RESULT_DIR, exist_ok=True)

ملاحظة: هذا مثال بسيط. لتحسين جودة جدّي، نصح باستخدام نموذج Real-ESRGAN مثبت محلياً

@app.route('/enhance', methods=['POST']) def enhance(): if 'image' not in request.files: return jsonify({'error': 'no image'}), 400 f = request.files['image'] filename = os.path.join(UPLOAD_DIR, f.filename) f.save(filename)

# مثال: استدعاء Real-ESRGAN عبر سطر الأوامر (معلّمات افتراضية)
# افترض أنك نصبت realesrgan-cli أو script جاهز لاستقبال ملف وإخراج ملف
input_path = filename
output_path = os.path.join(RESULT_DIR, f'res_{os.path.basename(f.filename)}')

try:
    # مثال توضيحي: استبدل هذا بأمر realesrgan المناسب عند التثبيت
    # subprocess.run(['realesrgan-ncnn-vulkan', '-i', input_path, '-o', output_path, '-s', '4'], check=True)

    # بديل مؤقت: نستخدم Pillow لتكبير الصورة (هذا ليس تعزيزًا حقيقيًا لكنه يعمل كبديل سريع)
    img = Image.open(input_path).convert('RGB')
    w, h = img.size
    new_size = (w*2, h*2)  # تكبير مؤقت - استبدله بعملية AI
    img = img.resize(new_size, Image.LANCZOS)
    img.save(output_path, 'PNG')

    return send_file(output_path, mimetype='image/png')
except subprocess.CalledProcessError as e:
    return jsonify({'error': 'processing failed', 'details': str(e)}), 500
except Exception as e:
    return jsonify({'error': str(e)}), 500

if name == 'main': app.run(host='0.0.0.0', port=5000, debug=True)

--- File: README.md ---

Pixel - تعليمات مختصرة

1. ثبت بيئة Python: python3 -m venv venv && source venv/bin/activate


2. ثبت الحزم: pip install flask pillow


3. لو تريد Real-ESRGAN حقيقي، اتبع توثيق المشروع الرسمي وثبّت النموذج ثم عدّل قسم subprocess في server.py


4. شغّل السيرفر: python server.py


5. فتح مشروع Flutter: ضع ملف main.dart بمساره، ثبت الحزم image_picker, http, path_provider, share_plus ثم شغّل flutter run



// الحزم Flutter التي تحتاج تضيفها في pubspec.yaml: // image_picker: ^0.8.7+4 // http: ^0.13.5 // path_provider: ^2.0.11 // share_plus: ^6.3.0

// انتهى

