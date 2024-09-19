// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ChevronLeft, ChevronRight, Menu, Star, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// const images = [
//   "/placeholder.svg?height=400&width=800&text=Delicious+Cereals",
//   "/placeholder.svg?height=400&width=800&text=Healthy+Breakfast",
//   "/placeholder.svg?height=400&width=800&text=Start+Your+Day+Right"
// ]

// const cereals = [
//   { name: "Crunchy Oats", description: "Wholesome and nutritious start to your day" },
//   { name: "Fruity Loops", description: "A colorful and tasty breakfast treat" },
//   { name: "Chocolate Puffs", description: "Indulgent chocolate flavor in every bite" }
// ]

// const reviews = [
//   { name: "Alice", rating: 5, comment: "Love the variety of cereals!" },
//   { name: "Bob", rating: 4, comment: "Great taste and healthy options." },
//   { name: "Charlie", rating: 5, comment: "My kids' favorite breakfast!" }
// ]

// export default function Component() {
//   const [currentImage, setCurrentImage] = useState(0)
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const [salesCount, setSalesCount] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSalesCount((prevCount) => prevCount + 1)
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   const nextImage = () => {
//     setCurrentImage((prevImage) => (prevImage + 1) % images.length)
//   }

//   const prevImage = () => {
//     setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length)
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-yellow-100">
//       <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="container flex h-16 items-center">
//           <Link href="/" className="flex items-center space-x-2">
//             <span className="font-bold text-2xl text-orange-600">CerealHub</span>
//           </Link>
//           <nav className="ml-auto hidden md:flex items-center space-x-4 lg:space-x-6">
//             <Link
//               href="/"
//               className="text-sm font-medium transition-colors hover:text-orange-600"
//             >
//               Home
//             </Link>
//             <Link
//               href="/products"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-orange-600"
//             >
//               Products
//             </Link>
//             <Link
//               href="/register"
//               className="text-sm font-medium text-muted-foreground transition-colors hover:text-orange-600"
//             >
//               Registration
//             </Link>
//           </nav>
//           <Button
//             className="ml-auto md:hidden"
//             variant="ghost"
//             size="icon"
//             aria-label="Toggle Menu"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </Button>
//         </div>
//       </header>
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm md:hidden">
//           <nav className="flex flex-col items-center justify-center h-full space-y-8">
//             <Link
//               href="/"
//               className="text-2xl font-medium text-orange-600"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Home
//             </Link>
//             <Link
//               href="/products"
//               className="text-2xl font-medium text-orange-600"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Products
//             </Link>
//             <Link
//               href="/register"
//               className="text-2xl font-medium text-orange-600"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Registration
//             </Link>
//           </nav>
//         </div>
//       )}
//       <main className="flex-1">
//         <section className="relative h-[500px] overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x"></div>
//           <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNjZmQ4ZGMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
//           <Image
//             src={images[currentImage]}
//             alt="Cereal"
//             layout="fill"
//             objectFit="cover"
//             className="mix-blend-overlay"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h1 className="text-5xl md:text-7xl font-bold text-white text-center drop-shadow-lg">
//               Discover the Taste of Happiness
//             </h1>
//           </div>
//           <Button
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
//             size="icon"
//             onClick={prevImage}
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </Button>
//           <Button
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
//             size="icon"
//             onClick={nextImage}
//           >
//             <ChevronRight className="h-6 w-6" />
//           </Button>
//         </section>
//         <section className="py-16 bg-gradient-to-b from-orange-100 to-yellow-200">
//           <div className="container">
//             <h2 className="text-4xl font-bold text-center mb-12 text-orange-800">Our Delightful Cereals</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {cereals.map((cereal, index) => (
//                 <Card key={index} className="group overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
//                   <CardContent className="p-6">
//                     <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
//                       <Image
//                         src={`/placeholder.svg?height=200&width=300&text=${cereal.name}`}
//                         alt={cereal.name}
//                         layout="fill"
//                         objectFit="cover"
//                         className="transition-transform group-hover:scale-110"
//                       />
//                     </div>
//                     <h3 className="text-xl font-semibold mb-2 text-orange-700">{cereal.name}</h3>
//                     <p className="text-gray-600 group-hover:text-orange-600 transition-colors">
//                       {cereal.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>
//         <section className="py-16 bg-gradient-to-b from-yellow-200 to-orange-100 relative">
//           <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgMzZjLTUuNSAwLTEwLTQuNS0xMC0xMHM0LjUtMTAgMTAtMTAgMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHpNNjAgNjBIMEw2MCAweiIgZmlsbD0iI2Y1OGEwNyIgZmlsbC1vcGFjaXR5PSIwLjIiPjwvcGF0aD4KPC9zdmc+')]"></div>
//           <div className="container relative">
//             <h2 className="text-4xl font-bold text-center mb-12 text-orange-800">How It Works</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
//                   1
//                 </div>
//                 <h3 className="text-2xl font-semibold mb-4 text-orange-700">Create an account</h3>
//                 <p className="text-gray-700">Sign up and set up your profile in just a few clicks</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
//                   2
//                 </div>
//                 <h3 className="text-2xl font-semibold mb-4 text-orange-700">Choose a product</h3>
//                 <p className="text-gray-700">Browse our delicious selection of cereals</p>
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg">
//                   3
//                 </div>
//                 <h3 className="text-2xl font-semibold mb-4 text-orange-700">Place an order</h3>
//                 <p className="text-gray-700">Complete your purchase and enjoy your breakfast!</p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="py-16 bg-gradient-to-b from-orange-100 to-yellow-200 relative overflow-hidden">
//           <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI2Y1OGEwNyIgZmlsbC1vcGFjaXR5PSIwLjIiPjwvY2lyY2xlPgo8L3N2Zz4=')]"></div>
//           <div className="container relative text-center">
//             <h2 className="text-4xl font-bold mb-8 text-orange-800">Sales Counter</h2>
//             <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 inline-block">
//               <p className="text-6xl font-bold text-orange-600 mb-2">{salesCount.toLocaleString()}</p>
//               <p className="text-xl text-gray-700">Happy customers and counting!</p>
//             </div>
//           </div>
//         </section>
//         <section className="py-16 bg-gradient-to-b from-yellow-200 to-orange-100">
//           <div className="container">
//             <h2 className="text-4xl font-bold text-center mb-12 text-orange-800">Customer Reviews</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {reviews.map((review, index) => (
//                 <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
//                   <CardContent className="p-6">
//                     <div className="flex items-center mb-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
//                         {review.name[0]}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg text-orange-700">{review.name}</h3>
//                         <div className="flex">
//                           {[...Array(review.rating)].map((_, i) => (
//                             <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-gray-600 italic">{review.comment}</p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="py-8 bg-gradient-to-b from-orange-200 to-orange-300">
//         <div className="container text-center">
//           <p className="text-orange-800 font-medium">&copy; 2023 B2BHub India. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }