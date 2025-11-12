const Team = () => {
  return (
    <>
      <section id="team" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Team 개발냄새
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "영호",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "창수",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "달현",
                role: "백앤드",
                dept: "모바일소프트웨어트랙 & 웹공학트랙",
              },
              {
                name: "지원",
                role: "백앤드",
                dept: "웹공학트랙 & 모바일소프트웨어트랙",
              },
              {
                name: "민서",
                role: "프론트",
                dept: "웹공학트랙 & 모바일소프트웨어트랙",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name}
                </div>
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{member.role}</p>
                <p className="text-xs text-gray-400">{member.dept}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
