import prisma from "@/utils/prisma";
import { NextResponse } from 'next/server';
import uploadToCloudinary from "@/utils/cloudinary";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multipart form data
  },
};

export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany({
      include: {
        owner: true,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Berhasil ambil semua data!",
      data: kelas,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function POST(req) {
  try {
    // Get the content type header
    const contentType = req.headers.get('content-type') || '';

    // Check if the content type is multipart/form-data
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ status: 400, message: 'Invalid content type' });
    }

    // Parse the form data
    const formData = await req.formData();
    
    const fileList = formData.getAll('file');
    const data = JSON.parse(formData.get('data'));

    // Set default value for kategori if it's an empty string
    const kategori = data.kategori === "" ? "General" : data.kategori;

    // Initialize modulUrl
    let modulUrl = "";

    if (fileList.length > 0 && fileList[0]) {
      const file = fileList[0];
      // Read the file buffer
      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      console.log("form data : ", data);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(buffer);
      modulUrl = result.secure_url; // Get the uploaded file URL from Cloudinary
    }

    // Save the class data along with the modul URL
    const kelas = await prisma.kelas.create({
      data: {
        nama: data.nama,
        kategori: kategori,
        materi: data.materi,
        spesifikasi: data.spesifikasi,
        metode: data.metode,
        jadwal: data.jadwal,
        durasi: data.durasi,
        harga: parseInt(data.harga),
        modul: modulUrl, // Store the Cloudinary file URL in the database if it exists
        owner: {
          connect: { id: data.ownerId }
        }
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Berhasil buat data!",
      data: kelas,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400, message: 'Something went wrong!' });
  }
}
