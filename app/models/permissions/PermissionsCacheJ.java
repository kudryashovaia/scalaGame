package models.permissions;

import com.github.benmanes.caffeine.cache.AsyncLoadingCache;
import com.github.benmanes.caffeine.cache.CacheLoader;
import com.github.benmanes.caffeine.cache.Caffeine;

import javax.annotation.Nonnull;
import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

/* Trying to use Caffeine cache from scala gives me horrible errors, so I will try to do it from pure java */
@Singleton
public class PermissionsCacheJ {

    private AsyncLoadingCache<Long, Permissions> cache;

    @Inject()
    public PermissionsCacheJ(PermissionsGetter permissionsGetter) {
        cache = Caffeine
                .newBuilder()
                .maximumSize(Long.MAX_VALUE)
                .expireAfterWrite(30, TimeUnit.SECONDS)
                .buildAsync(new CacheLoader<Long, Permissions>() {
                    @Override
                    public Permissions load(@Nonnull Long key) throws Exception {
                        throw new UnsupportedOperationException("This loader is async");
                    }

                    @Nonnull
                    @Override
                    public CompletableFuture<Permissions> asyncLoad(@Nonnull Long userId, @Nonnull Executor executor) {
                        return permissionsGetter.getUserPermissions(userId);
                    }
                });
    }

    public CompletableFuture<Permissions> getUserPermissions(Long userId) {
        return cache.get(userId);
    }

    public void clear(Long userId) {
        cache.synchronous().invalidate(userId);
    }

}
