import prisma from "@/utils/prisma";

export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany();

    return Response.json({
      status: 200,
      message: "Berhasil ambil semua data!",
      data: kelas,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const kelas = await prisma.kelas.create({ data:{
        nama: data.nama,
        kategori: data.kategori,
        materi: data.materi,
        spesifikasi: data.spesifikasi,
        metode: data.metode,
        jadwal: data.jadwal,
        owner: {
            connect: {id: data.ownerId}
        }
    } });

    return Response.json({
      status: 200,
      message: "Berhasil buat data!",
      data: kelas,  
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}


