const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/components/dashboard');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles(directoryPath);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if this file has emptyState={
  if (!content.includes('emptyState={')) continue;

  // We already updated AuditLog and AdminUsersPanel, skip them
  if (file.includes('AuditLog.tsx') || file.includes('AdminUsersPanel.tsx') || file.includes('TripsPanel.tsx')) {
    continue;
  }

  // Ensure DashboardFilterEmptyState is imported
  if (!content.includes('DashboardFilterEmptyState')) {
    content = content.replace(
      'import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";',
      'import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";\nimport DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";'
    );
  }

  // Common pattern 1: Object.values(appliedFilters)
  const regex1 = /(\)\s*:\s*)undefined(\s*\n\s*})/g;
  
  if (content.match(regex1)) {
    // Determine the variable name for clear filters
    let onClearName = 'resetFilters';
    if (content.includes('onClearSearch={onClearSearch}')) {
        onClearName = 'onClearSearch';
    } else if (content.includes('onClearSearch={onClearSearch || resetFilters}')) {
        onClearName = 'onClearSearch || resetFilters';
    } else if (content.includes('onClearSearch={handleClean}')) {
        onClearName = 'handleClean';
    }

    // Replace all ": undefined }" with ": !searchQuery ? <DashboardFilterEmptyState ... /> : undefined }"
    // BUT we need to be careful to only do this for the emptyState block.
    // Instead of regex, let's just do a specific string replace for the ones we know
    if (content.includes('!searchQuery && Object.values(appliedFilters).every((v) => v === "All")')) {
      content = content.replace(
        /(\)\s*:\s*)undefined(\s*\n\s*})/g,
        `$1!searchQuery && Object.values(appliedFilters).some((v) => v !== "All") ? (
              <DashboardFilterEmptyState
                onClearFilters={${onClearName}}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined$2`
      );
    } else if (content.includes('!searchQuery && !appliedSourceFilter && !appliedStatusFilter')) {
      content = content.replace(
        /(\)\s*:\s*)undefined(\s*\n\s*})/g,
        `$1!searchQuery && (appliedSourceFilter || appliedStatusFilter) ? (
              <DashboardFilterEmptyState
                onClearFilters={${onClearName}}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined$2`
      );
    } else if (content.includes('!searchQuery && !appliedStatusFilter')) {
      content = content.replace(
        /(\)\s*:\s*)undefined(\s*\n\s*})/g,
        `$1!searchQuery && appliedStatusFilter ? (
              <DashboardFilterEmptyState
                onClearFilters={${onClearName}}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined$2`
      );
    } else {
        // Fallback generic replacement
        content = content.replace(
            /(\)\s*:\s*)undefined(\s*\n\s*})/g,
            `$1!searchQuery ? (
              <DashboardFilterEmptyState
                onClearFilters={${onClearName}}
                title="No Results Found"
                subtitle="No results match the selected filters."
              />
            ) : undefined$2`
        );
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
