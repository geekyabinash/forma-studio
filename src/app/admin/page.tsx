import { Briefcase, Users, Image, Mail, FolderOpen, FileText, Phone } from 'lucide-react'
import { db } from '@/lib/db'
import { services, careerPositions, galleryItems, formSubmissions, projects } from '@/lib/db/schema'
import { count, eq } from 'drizzle-orm'

export default async function AdminDashboard() {
  let projectCount = 0
  let serviceCount = 0
  let positionCount = 0
  let galleryCount = 0
  let unreadCount = 0

  try {
    const [pr, s, p, g, u] = await Promise.all([
      db.select({ count: count() }).from(projects),
      db.select({ count: count() }).from(services),
      db.select({ count: count() }).from(careerPositions).where(eq(careerPositions.isActive, true)),
      db.select({ count: count() }).from(galleryItems),
      db.select({ count: count() }).from(formSubmissions).where(eq(formSubmissions.status, 'unread')),
    ])
    projectCount = pr[0]?.count ?? 0
    serviceCount = s[0]?.count ?? 0
    positionCount = p[0]?.count ?? 0
    galleryCount = g[0]?.count ?? 0
    unreadCount = u[0]?.count ?? 0
  } catch (err) {
    console.error('[AdminDashboard] Failed to fetch stats:', err)
  }

  const stats = [
    {
      name: 'Total Projects',
      value: String(projectCount),
      icon: FolderOpen,
      color: 'from-[#D4B896]/20 to-[#D4B896]/5',
      iconColor: 'text-[#D4B896]',
    },
    {
      name: 'Total Services',
      value: String(serviceCount),
      icon: Briefcase,
      color: 'from-[#D4654A]/20 to-[#D4654A]/5',
      iconColor: 'text-[#D4654A]',
    },
    {
      name: 'Active Positions',
      value: String(positionCount),
      icon: Users,
      color: 'from-[#D4B896]/20 to-[#D4B896]/5',
      iconColor: 'text-[#D4B896]',
    },
    {
      name: 'Gallery Images',
      value: String(galleryCount),
      icon: Image,
      color: 'from-[#F5E6D0]/20 to-[#F5E6D0]/5',
      iconColor: 'text-[#F5E6D0]',
    },
    {
      name: 'Unread Messages',
      value: String(unreadCount),
      icon: Mail,
      color: 'from-[#D4654A]/20 to-[#D4654A]/5',
      iconColor: 'text-[#D4654A]',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl md:text-5xl text-[#F5E6D0] mb-2">
          Dashboard
        </h1>
        <p className="font-josefin text-[#D4B896] text-sm">
          Welcome back to your admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300`} />

              {/* Card */}
              <div className="relative bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10
                hover:border-[#F5E6D0]/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-josefin text-[#D4B896] text-sm mb-1">
                      {stat.name}
                    </p>
                    <p className="font-cormorant text-4xl text-[#F5E6D0]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1A2332] rounded-xl p-6 border border-[#F5E6D0]/10">
        <h2 className="font-cormorant text-2xl text-[#F5E6D0] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <a
            href="/admin/projects/new"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <FolderOpen className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Add New Project</p>
          </a>

          <a
            href="/admin/services/new"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <Briefcase className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Add New Service</p>
          </a>

          <a
            href="/admin/careers"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <Users className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Manage Careers</p>
          </a>

          <a
            href="/admin/gallery"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <Image className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Upload to Gallery</p>
          </a>

          <a
            href="/admin/about"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <FileText className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Edit About Page</p>
          </a>

          <a
            href="/admin/contact"
            className="p-4 bg-[#141B2B] rounded-lg border border-[#F5E6D0]/10
              hover:border-[#D4654A] hover:bg-[#D4654A]/5
              transition-all duration-300 group"
          >
            <Phone className="w-5 h-5 text-[#D4B896] group-hover:text-[#D4654A] mb-2 transition-colors" />
            <p className="font-josefin text-[#F5E6D0] text-sm">Edit Contact Info</p>
          </a>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-8 p-6 bg-gradient-to-r from-[#D4654A]/10 to-[#D4B896]/10 rounded-xl border border-[#F5E6D0]/10">
        <h3 className="font-cormorant text-xl text-[#F5E6D0] mb-2">
          Getting Started
        </h3>
        <p className="font-josefin text-[#D4B896] text-sm mb-4">
          Your admin panel is ready! Start by managing your website content:
        </p>
        <ul className="font-josefin text-[#F5E6D0]/80 text-sm space-y-2">
          <li>• Add, edit, or remove projects in the Projects section</li>
          <li>• Add or edit services in the Services section</li>
          <li>• Manage job postings and benefits in Careers</li>
          <li>• Upload and organize images in Gallery</li>
          <li>• View form submissions in the Inbox</li>
          <li>• Edit your About page content and timeline</li>
          <li>• Update contact information and office hours</li>
        </ul>
      </div>
    </div>
  )
}
